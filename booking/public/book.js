(function () {
  "use strict";

  const STORAGE_KEY = "booking:tz";
  const MAX_DEFAULT = 5;

  const TIMEZONES = [
    { id: "Asia/Shanghai", labelZh: "中国（北京/广州）", labelEn: "China (Beijing/Guangzhou)" },
    { id: "Asia/Hong_Kong", labelZh: "香港", labelEn: "Hong Kong" },
    { id: "Asia/Singapore", labelZh: "新加坡", labelEn: "Singapore" },
    { id: "Asia/Tokyo", labelZh: "日本", labelEn: "Japan" },
    { id: "Europe/London", labelZh: "英国（伦敦）", labelEn: "UK (London)" },
    { id: "Europe/Tallinn", labelZh: "爱沙尼亚（塔林）", labelEn: "Estonia (Tallinn)" },
    { id: "America/New_York", labelZh: "美国东部", labelEn: "US Eastern" },
    { id: "America/Los_Angeles", labelZh: "美国太平洋", labelEn: "US Pacific" },
    { id: "UTC", labelZh: "UTC", labelEn: "UTC" },
  ];

  function readConfig() {
    const el = document.getElementById("booking-config");
    if (!el) return null;
    try {
      return JSON.parse(el.textContent || "");
    } catch {
      return null;
    }
  }

  function detectTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Shanghai";
    } catch {
      return "Asia/Shanghai";
    }
  }

  function storedTimezone() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveTimezone(tz) {
    try {
      localStorage.setItem(STORAGE_KEY, tz);
    } catch {
      /* ignore */
    }
  }

  function dateKeyInTz(iso, tz) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  }

  function timeInTz(iso, tz, locale) {
    return new Intl.DateTimeFormat(locale, {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(iso));
  }

  function formatDayTab(dateKey, tz, locale) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const anchor = new Date(Date.UTC(y, m - 1, d, 12, 0));
    return new Intl.DateTimeFormat(locale, {
      timeZone: tz,
      weekday: "short",
      month: "numeric",
      day: "numeric",
    }).format(anchor);
  }

  function studioDateKey(iso) {
    return iso.slice(0, 10);
  }

  function formatStudioDate(dateKey, locale) {
    const [y, m, d] = dateKey.split("-").map(Number);
    if (locale.startsWith("zh")) {
      return `${m}月${d}日`;
    }
    const anchor = new Date(Date.UTC(y, m - 1, d, 12, 0));
    return new Intl.DateTimeFormat("en-GB", {
      month: "short",
      day: "numeric",
    }).format(anchor);
  }

  function groupSlotsByUserDate(slots, userTz) {
    const groups = new Map();

    for (const slot of slots) {
      const userDate = dateKeyInTz(slot.startIso, userTz);
      const localTime = timeInTz(slot.startIso, userTz, "en-GB");
      const studioDate = studioDateKey(slot.startIso);
      const entry = {
        ...slot,
        userDate,
        localTime,
        studioDate,
        sortKey: new Date(slot.startIso).getTime(),
      };

      if (!groups.has(userDate)) {
        groups.set(userDate, []);
      }
      groups.get(userDate).push(entry);
    }

    for (const list of groups.values()) {
      list.sort((a, b) => a.sortKey - b.sortKey);
    }

    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }

  function initPurposePills(form) {
    const group = form.querySelector(".purpose-pills");
    if (!group) return;

    const pills = group.querySelectorAll(".purpose-pill");
    const radios = form.querySelectorAll('input[type="radio"][name="purpose"]');

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const value = pill.getAttribute("data-value");
        radios.forEach((radio) => {
          const input = /** @type {HTMLInputElement} */ (radio);
          input.checked = input.value === value;
        });
        syncPurposePills(form);
      });
    });

    syncPurposePills(form);
  }

  function syncPurposePills(form) {
    const checked = form.querySelector('input[type="radio"][name="purpose"]:checked');
    const value = checked ? checked.getAttribute("value") : "trial";
    form.querySelectorAll(".purpose-pill").forEach((pill) => {
      pill.setAttribute("aria-pressed", pill.getAttribute("data-value") === value ? "true" : "false");
    });
  }

  function initSlotPicker(config) {
    const root = document.getElementById("slot-picker");
    const form = document.getElementById("booking-form");
    if (!root || !form) return;

    const locale = config.locale || "zh";
    const copy = config.copy || {};
    const maxSelections = config.maxPreferences || MAX_DEFAULT;
    const studioTz = config.studioTimezone || "Asia/Shanghai";
    const intlLocale = locale === "en" ? "en-GB" : "zh-CN";

    let userTz = storedTimezone() || detectTimezone();
    if (!TIMEZONES.some((tz) => tz.id === userTz)) {
      userTz = detectTimezone();
    }

    let selected = new Set();
    let activeDate = null;

    const tzSelect = document.getElementById("timezone-select");
    const dayTabsEl = document.getElementById("day-tabs");
    const timeGridEl = document.getElementById("time-grid");
    const summaryEl = document.getElementById("selection-summary");
    const countEl = document.getElementById("selected-count");
    const hiddenInputsEl = document.getElementById("slot-hidden-inputs");
    const clientTzInput = document.getElementById("client-timezone-input");

    if (tzSelect) {
      TIMEZONES.forEach((tz) => {
        const opt = document.createElement("option");
        opt.value = tz.id;
        opt.textContent = locale === "en" ? tz.labelEn : tz.labelZh;
        if (tz.id === userTz) opt.selected = true;
        tzSelect.appendChild(opt);
      });

      if (!TIMEZONES.some((tz) => tz.id === userTz)) {
        const opt = document.createElement("option");
        opt.value = userTz;
        opt.textContent = userTz;
        opt.selected = true;
        tzSelect.insertBefore(opt, tzSelect.firstChild);
      }

      tzSelect.addEventListener("change", () => {
        userTz = tzSelect.value;
        saveTimezone(userTz);
        activeDate = null;
        render();
      });
    }

    function syncHiddenInputs() {
      if (!hiddenInputsEl) return;
      hiddenInputsEl.innerHTML = "";
      for (const id of selected) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "preferredSlots";
        input.value = id;
        hiddenInputsEl.appendChild(input);
      }
      if (clientTzInput) {
        clientTzInput.value = userTz;
      }
    }

    function renderSummary() {
      if (!summaryEl || !countEl) return;

      countEl.textContent = copy.selectedCount
        ? copy.selectedCount.replace("{n}", String(selected.size)).replace("{max}", String(maxSelections))
        : `${selected.size}/${maxSelections}`;

      const list = summaryEl.querySelector("ul");
      if (!list) return;
      list.innerHTML = "";

      if (selected.size === 0) {
        summaryEl.hidden = true;
        return;
      }

      summaryEl.hidden = false;
      const slotsById = new Map(config.slots.map((s) => [s.id, s]));

      for (const id of selected) {
        const slot = slotsById.get(id);
        if (!slot) continue;

        const li = document.createElement("li");
        const label = document.createElement("span");
        const userDate = dateKeyInTz(slot.startIso, userTz);
        const start = timeInTz(slot.startIso, userTz, intlLocale);
        const end = timeInTz(slot.endIso, userTz, intlLocale);
        label.textContent = `${formatDayTab(userDate, userTz, intlLocale)} ${start}–${end}`;

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove-slot";
        removeBtn.textContent = locale === "en" ? "Remove" : "移除";
        removeBtn.addEventListener("click", () => {
          selected.delete(id);
          render();
        });

        li.appendChild(label);
        li.appendChild(removeBtn);
        list.appendChild(li);
      }
    }

    function renderTimeGrid(entries) {
      if (!timeGridEl) return;
      timeGridEl.innerHTML = "";

      if (!entries || entries.length === 0) {
        const p = document.createElement("p");
        p.className = "no-slots";
        p.textContent = copy.noSlotsForDay || (locale === "en" ? "No slots on this day." : "该日暂无可用时段。");
        timeGridEl.appendChild(p);
        return;
      }

      const atMax = selected.size >= maxSelections;

      for (const entry of entries) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "time-chip";
        btn.dataset.slotId = entry.id;

        const isSelected = selected.has(entry.id);
        btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
        btn.disabled = !isSelected && atMax;

        const main = document.createElement("span");
        main.textContent = entry.localTime;
        btn.appendChild(main);

        if (entry.studioDate !== entry.userDate) {
          const note = document.createElement("span");
          note.className = "ellen-note";
          note.textContent = locale === "en"
            ? `Ellen: ${formatStudioDate(entry.studioDate, locale)} CST`
            : `Ellen 侧 ${formatStudioDate(entry.studioDate, locale)}`;
          btn.appendChild(note);
        }

        btn.addEventListener("click", () => {
          if (selected.has(entry.id)) {
            selected.delete(entry.id);
          } else if (selected.size < maxSelections) {
            selected.add(entry.id);
          }
          render();
        });

        timeGridEl.appendChild(btn);
      }
    }

    function renderDayTabs(groups) {
      if (!dayTabsEl) return;
      dayTabsEl.innerHTML = "";

      if (groups.length === 0) {
        renderTimeGrid([]);
        return;
      }

      if (!activeDate || !groups.some(([d]) => d === activeDate)) {
        activeDate = groups[0][0];
      }

      for (const [dateKey] of groups) {
        const tab = document.createElement("button");
        tab.type = "button";
        tab.className = "day-tab";
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", dateKey === activeDate ? "true" : "false");
        tab.textContent = formatDayTab(dateKey, userTz, intlLocale);
        tab.addEventListener("click", () => {
          activeDate = dateKey;
          render();
        });
        dayTabsEl.appendChild(tab);
      }

      const activeGroup = groups.find(([d]) => d === activeDate);
      renderTimeGrid(activeGroup ? activeGroup[1] : []);
    }

    function render() {
      const groups = groupSlotsByUserDate(config.slots, userTz);
      renderDayTabs(groups);
      renderSummary();
      syncHiddenInputs();
    }

    form.addEventListener("submit", (event) => {
      syncHiddenInputs();
      if (selected.size === 0) {
        event.preventDefault();
        alert(copy.selectAtLeastOne || (locale === "en" ? "Please choose at least one time." : "请至少选择一个时段。"));
      }
    });

    document.documentElement.classList.remove("no-js");
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const config = readConfig();
    const form = document.getElementById("booking-form");
    if (form) initPurposePills(form);
    if (config) initSlotPicker(config);
  });
})();
