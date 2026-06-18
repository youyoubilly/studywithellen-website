#!/usr/bin/env python3
"""Generate per-school research folders for Guangzhou international schools."""
from pathlib import Path
import json

ROOT = Path(__file__).parent

SCHOOLS = [
    # 荔湾区
    {"slug": "isa-liwan-international-school", "district": "荔湾区", "en": "ISA Liwan International School", "cn": "广州荔湾爱莎外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "IB PYP/MYP/DP", "website": "https://www.isagz.com", "address": "广州市荔湾区海龙路", "fees": "约 26–30 万/年（参考同类爱莎校区）", "notes": "爱莎集团荔湾校区；IB 全学段；外籍/港澳台子女为主。", "ellen": "高年级 IB + 出国路径；家长对学术英语、雅思口语需求强。"},
    {"slug": "isa-wenhua-liwan-school", "district": "荔湾区", "en": "ISA Wenhua Liwan School", "cn": "广州荔湾爱莎文华学校", "type": "民办", "grades": "幼儿园–高中", "curriculum": "IB + 国内课程 / A-Level/AP", "website": "https://www.isagz.com", "address": "广州市荔湾区", "fees": "约 20–30 万/年", "notes": "爱莎体系民办双语校；可同时招收部分国内户籍学生。", "ellen": "双语高中部家长是雅思/学术英语潜在客户。"},
    {"slug": "guangdong-experimental-ap", "district": "荔湾区", "en": "Guangdong Experimental High School (AP)", "cn": "广东实验中学AP国际课程", "type": "公立国际部", "grades": "高中", "curriculum": "AP (SSAP)", "website": "https://www.gdsyzx.edu.cn", "address": "广州市荔湾区中山四路", "fees": "约 23.8 万/年", "notes": "省实 AP 国际班；录取竞争激烈；出口以美国为主。", "ellen": "顶尖公立国际部；学生学术压力大，口语/写作辅导需求高。"},
    {"slug": "guangdong-experimental-alevel", "district": "荔湾区", "en": "Guangdong Experimental High School (A-Level)", "cn": "广东实验中学中英A-Level课程", "type": "公立国际部", "grades": "高中", "curriculum": "A-Level", "website": "https://www.gdsyzx.edu.cn", "address": "广州市荔湾区", "fees": "约 20.8 万/年", "notes": "省实 A-Level 项目；英国/澳洲方向。", "ellen": "A-Level 学术写作与 presentation 是 Ellen 强项匹配点。"},
    {"slug": "guangya-high-school-international", "district": "荔湾区", "en": "Guangya High School International Curriculum", "cn": "广东广雅中学国际课程", "type": "公立国际部", "grades": "高中", "curriculum": "AP, A-Level", "website": "https://www.gyzx.edu.cn", "address": "广州市荔湾区广雅路", "fees": "约 15.8 万/年", "notes": "百年名校广雅国际部；学术氛围浓厚。", "ellen": "传统强校国际部；家长重视升学与英语硬实力。"},
    {"slug": "guangzhou-concordia-international", "district": "荔湾区", "en": "Guangzhou Concordia School International Dept.", "cn": "广州协和学校国际部", "type": "公立国际部", "grades": "高中", "curriculum": "AP", "website": "", "address": "广州市荔湾区", "fees": "公办国际部价位", "notes": "协和中学国际部；AP 方向。", "ellen": "荔湾公立国际部；可透过家长群转介绍触达。"},
    {"slug": "zhenguang-high-school-international", "district": "荔湾区", "en": "Guangzhou Zhenguang High School International Dept.", "cn": "广州市真光中学国际部", "type": "公立国际部", "grades": "高中", "curriculum": "美国高中课程 / AP", "website": "", "address": "广州市荔湾区", "fees": "公办国际部价位", "notes": "真光中学国际班；女校背景（部分学段）。", "ellen": "女生家长群体；口语自信与面试辅导需求。"},
    {"slug": "guangzhou-no1-high-school-international", "district": "荔湾区", "en": "Guangzhou No.1 High School International Program", "cn": "广州市第一中学国际班", "type": "公立国际部", "grades": "高中", "curriculum": "PGA 高中国际课程", "website": "", "address": "广州市荔湾区", "fees": "公办国际部价位", "notes": "市一中国际课程（PGA）。", "ellen": "中等规模国际部；课外辅导市场活跃。"},
    {"slug": "xiguan-foreign-language-school", "district": "荔湾区", "en": "Guangzhou Xiguan Foreign Language School International Dept.", "cn": "广州市西关外国语学校国际部", "type": "公立国际部", "grades": "高中", "curriculum": "AP", "website": "", "address": "广州市荔湾区", "fees": "约 10 万/年", "notes": "西关外国语学校国际部；外语特色。", "ellen": "外语背景校；口语提升需求明确。"},
    {"slug": "guangzhou-peiying-high-school-international", "district": "荔湾区", "en": "Guangzhou Peiying High School International Dept.", "cn": "广州培英中学国际部", "type": "公立国际部", "grades": "高中", "curriculum": "A-Level", "website": "", "address": "广州市荔湾区", "fees": "约 4.4 万/学期", "notes": "培英中学国际部；A-Level。", "ellen": "性价比较高的国际部；家长可能更关注实效辅导。"},
    # 越秀区
    {"slug": "aisg-ersha", "district": "越秀区", "en": "American International School of Guangzhou (Ersha)", "cn": "广州美国人外籍人员子女学校（二沙校区）", "type": "外籍", "grades": "幼儿园–小学（低龄段）", "curriculum": "IB + American", "website": "https://www.aisgz.org", "address": "广州市越秀区二沙岛", "fees": "约 22–30 万/年（2025/26）", "notes": "AISG 二沙校区；广州老牌美式外籍校；IB 授权。", "ellen": "高端外籍社区；家长多为外企高管；商务/学术英语需求。"},
    {"slug": "zhixin-ersha-international", "district": "越秀区", "en": "Zhixin High School Ersha International Campus", "cn": "广州执信中学二沙岛国际校区", "type": "公立国际部", "grades": "高中", "curriculum": "AP", "website": "https://www.zhixin.edu.cn", "address": "广州市越秀区二沙岛", "fees": "约 14.8 万/年", "notes": "执信二沙国际校区；顶级公立国际部之一。", "ellen": "汇景/二沙高端家长圈；与 Ellen 目标受众高度重叠。"},
    {"slug": "gdsyzx-yuexiu-international", "district": "越秀区", "en": "Guangdong Experimental High School Yuexiu International Dept.", "cn": "广东实验中学越秀学校国际部", "type": "公立国际部", "grades": "高中", "curriculum": "DSE, A-Level, 加拿大课程", "website": "", "address": "广州市越秀区", "fees": "公办国际部价位", "notes": "省实越秀学校国际部；多轨制出口。", "ellen": "DSE + 海外双轨；口语与学术英语均可对接。"},
    {"slug": "tieyi-high-school-international", "district": "越秀区", "en": "Guangzhou Tieyi High School International Dept.", "cn": "广州市铁一中学国际部", "type": "公立国际部", "grades": "高中", "curriculum": "A-Level", "website": "https://www.tyzx.edu.cn", "address": "广州市越秀区", "fees": "公办国际部价位", "notes": "铁一国际部；英国方向强校。", "ellen": "铁一家长口碑传播力强；学术英语需求稳定。"},
    # 海珠区
    {"slug": "guangzhou-no6-high-school-icc", "district": "海珠区", "en": "Guangzhou No.6 High School ICC", "cn": "广州市第六中学国际课程中心", "type": "公立国际部", "grades": "高中", "curriculum": "AP", "website": "https://www.gz6hs.cn", "address": "广州市海珠区", "fees": "约 15 万/年", "notes": "六中国际课程中心；AP 为主。", "ellen": "海珠强校国际部；高考+出国双轨家长群。"},
    {"slug": "haizhu-foreign-language-experimental-international", "district": "海珠区", "en": "Haizhu Foreign Language Experimental School International Dept.", "cn": "广州市海珠外国语实验中学国际部", "type": "公立国际部", "grades": "高中", "curriculum": "加拿大课程", "website": "", "address": "广州市海珠区", "fees": "公办国际部价位", "notes": "海珠外国语实验中学国际部。", "ellen": "外语特色公立国际部。"},
    {"slug": "guangzhou-weiming-school-international", "district": "海珠区", "en": "Guangzhou Weiming School International Dept.", "cn": "广州市为明学校国际部", "type": "民办", "grades": "小学–高中", "curriculum": "AP, A-Level, SACE", "website": "https://www.gzwmsy.com", "address": "广州市海珠区", "fees": "约 12–18 万/年", "notes": "为明教育集团；多课程体系民办国际学校。", "ellen": "大型民办国际部；生源广，课外辅导需求大。"},
    {"slug": "gmaa-guangmei-british-high-school", "district": "海珠区", "en": "GMAA Guangmei British-style High School", "cn": "GMAA广美英式高中", "type": "民办", "grades": "高中", "curriculum": "A-Level + 艺术", "website": "", "address": "广州市海珠区", "fees": "艺术国际高中价位", "notes": "广美背景英式艺术高中。", "ellen": "艺术生英语（作品集陈述、面试）细分需求。"},
    {"slug": "gisa-aip-art-high-school", "district": "海珠区", "en": "GISA International Art High School (AIP)", "cn": "GISA国际艺术高中（广美附中AIP）", "type": "民办", "grades": "高中", "curriculum": "艺术 + A-Level", "website": "https://www.aip-gd.com", "address": "广州市海珠区", "fees": "艺术国际高中价位", "notes": "广美附中 AIP 国际艺术高中。", "ellen": "艺术路径学生；口语面试与文书辅导。"},
    {"slug": "nanwu-middle-school-ccae", "district": "海珠区", "en": "Nanwu Middle School CCAE Experimental Class", "cn": "广州市南武中学CCAE实验班", "type": "公立", "grades": "高中", "curriculum": "加拿大课程 / 创新实验", "website": "", "address": "广州市海珠区", "fees": "公办价位", "notes": "南武中学 CCAE 实验班；加拿大方向。", "ellen": "创新实验班家长；升学导向明确。"},
    {"slug": "huafu-haizhu-bilingual-school", "district": "海珠区", "en": "Huafu Haizhu Bilingual School", "cn": "华附海珠双语学校", "type": "民办", "grades": "小学、初中", "curriculum": "双语课程", "website": "", "address": "广州市海珠区", "fees": "民办双语价位", "notes": "华附背景民办双语学校。", "ellen": "初中段家长；长期英语规划需求。"},
    # 天河区
    {"slug": "isa-tianhe-international-school", "district": "天河区", "en": "ISA Tianhe International School", "cn": "广州天河爱莎外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "IB PYP/MYP", "website": "https://www.isagz.com", "address": "广州市天河区", "fees": "约 26–30 万/年", "notes": "爱莎天河校区；IB 课程；天河核心区位。", "ellen": "天河外籍/港澳台家庭；高年级出国准备。"},
    {"slug": "scnu-affiliated-international-hfi", "district": "天河区", "en": "Affiliated High School of SCNU International (HFI)", "cn": "华南师范大学附属中学国际部", "type": "公立国际部", "grades": "高中", "curriculum": "AP (HFI)", "website": "https://www.hfi.net.cn", "address": "广州市天河区中山大道西", "fees": "约 20.8 万/年", "notes": "华附国际部 HFI；广州顶尖 AP 项目；自主招生。", "ellen": "顶级生源；雅思/托福与学术英语竞争激烈，口碑敏感。"},
    {"slug": "guangzhou-huamei-english-experimental", "district": "天河区", "en": "Guangzhou Huamei English Experimental School", "cn": "广州市华美英语实验学校", "type": "民办", "grades": "幼儿园–高中", "curriculum": "AP, A-Level, 加拿大等", "website": "https://www.huamei.org", "address": "广州市天河区华美路", "fees": "约 15–20 万/年", "notes": "华美学校；老牌民办英语实验学校；国际部多条产品线。", "ellen": "天河大型民办校；国际部家长基数大。"},
    {"slug": "guangzhou-nanfang-international-school", "district": "天河区", "en": "Guangzhou Nanfang International School", "cn": "广州南方外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "IB + British", "website": "", "address": "广州市天河区", "fees": "外籍学校价位", "notes": "南方国际学校；服务外籍人员子女。", "ellen": "外籍家庭；英语母语环境但仍可能有学术写作辅导需求。"},
    {"slug": "jnu-affiliated-hk-macao-school-tianhe", "district": "天河区", "en": "Affiliated School of JNU for HK & Macao Students (Tianhe)", "cn": "广州暨大港澳子弟学校（天河校区）", "type": "港澳子弟", "grades": "幼儿园–高中", "curriculum": "IB, DSE, A-Level", "website": "https://www.asjgz.com", "address": "广州市天河区", "fees": "约 15–22 万/年", "notes": "全国首家港澳子弟学校；暨南大学指导；大湾区标杆。", "ellen": "港澳子弟家长；DSE 英语口语 + 雅思双需求。"},
    {"slug": "tianxing-international-education-center", "district": "天河区", "en": "CIS at GTES (Tianxing International Education Center)", "cn": "广州天省实验学校国际教育中心", "type": "民办", "grades": "高中", "curriculum": "AP, A-Level", "website": "https://www.tianxing.com", "address": "广州市天河区", "fees": "约 16 万/年", "notes": "天省实验学校国际部；博杭合作 A-Level。", "ellen": "天河民办国际高中；升学导向强。"},
    {"slug": "meisha-academy-guangzhou", "district": "天河区", "en": "Meisha Academy Guangzhou", "cn": "广州梅沙书院", "type": "民办", "grades": "高中", "curriculum": "AP, IGCSE, A-Level, VCE", "website": "https://www.meisha.cn", "address": "广州市天河区", "fees": "约 14–18 万/年", "notes": "万科梅沙书院广州校区；创新教育理念。", "ellen": "创新民办高中；学生自主学习能力强，辅导需求精细化。"},
    {"slug": "no113-middle-school-canadian-international", "district": "天河区", "en": "Guangzhou No.113 Middle School Canadian Int'l Dept.", "cn": "广州市第113中学加拿大国际高中部", "type": "公立国际部", "grades": "高中", "curriculum": "加拿大 OSSD/Alberta", "website": "", "address": "广州市天河区", "fees": "公办国际部价位", "notes": "113 中学加拿大国际高中部。", "ellen": "加拿大方向公立国际部。"},
    {"slug": "aisg-science-park", "district": "天河区", "en": "American International School of Guangzhou (Science Park)", "cn": "广州美国人外籍人员子女学校（科学城校区）", "type": "外籍", "grades": "4–12 年级", "curriculum": "IB + American", "website": "https://www.aisgz.org", "address": "广州市天河区科学城", "fees": "约 22–30 万/年", "notes": "AISG 科学城校区；4–12 年级。", "ellen": "黄埔/天河交界外籍社区。"},
    {"slug": "huijing-xincheng-experimental-primary", "district": "天河区", "en": "Huijing Xincheng Experimental Primary School", "cn": "广州汇景新城实验小学", "type": "民办", "grades": "小学", "curriculum": "双语课程", "website": "", "address": "广州市天河区汇景新城", "fees": "民办小学价位", "notes": "汇景新城实验小学；天河高端社区配套。", "ellen": "Ellen 目标受众明确标注汇景家长圈；重点触达学校。"},
    # 白云区
    {"slug": "british-school-guangzhou-bsg", "district": "白云区", "en": "The British School of Guangzhou", "cn": "广州英国外籍人员子女学校", "type": "外籍", "grades": "1–18 岁", "curriculum": "British National Curriculum, IGCSE, A-Level", "website": "https://www.nordangliaeducation.com/bsg-guangzhou", "address": "广州市白云区同和街道", "fees": "约 20–29 万/年（2025/26）", "notes": "Nord Anglia 旗下 BSG；广州旗舰英式外籍校。", "ellen": "IGCSE/A-Level 学术英语与口语；HR 可对接教师合作。"},
    {"slug": "utahloy-international-school-guangzhou", "district": "白云区", "en": "Utahloy International School Guangzhou", "cn": "广州誉德莱外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "IB PYP/MYP/DP", "website": "https://www.uisgz.com", "address": "广州市白云区", "fees": "约 27.5 万/年", "notes": "誉德莱白云校区；IB 全授权；绿树成荫的校园。", "ellen": "IB 体系；高年级 DP 学术写作需求。"},
    {"slug": "britannia-international-school-guangzhou", "district": "白云区", "en": "Britannia International School Guangzhou", "cn": "广州市英伦外籍人员子女学校", "type": "外籍", "grades": "2–18 岁", "curriculum": "Cambridge IGCSE/A-Level, EYFS", "website": "https://www.britannia-gz.com", "address": "广州市白云区", "fees": "约 17–18.6 万/年", "notes": "英伦学校；剑桥课程；加拿大国际教育集团旗下。", "ellen": "剑桥体系；A-Level 口语与学术表达辅导。"},
    {"slug": "ecole-francaise-internationale-canton", "district": "白云区", "en": "École Française Internationale de Canton", "cn": "广州法国外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "French National Curriculum", "website": "https://www.efic-gz.com", "address": "广州市白云区", "fees": "约 15 万/年", "notes": "广州法国外籍人员子女学校。", "ellen": "法语背景家庭；英语作为第二外语的加强需求。"},
    {"slug": "guangwai-foreign-personnel-children-school", "district": "白云区", "en": "Guangzhou Foreign Affairs University International School", "cn": "广州广外外籍人员子女学校", "type": "外籍", "grades": "小学–高中", "curriculum": "IB, DSE, IGCSE", "website": "", "address": "广州市白云区", "fees": "约 17.6 万/年", "notes": "广外背景外籍人员子女学校。", "ellen": "外语教育背景；家长重视英语专业能力。"},
    {"slug": "yuanya-school", "district": "白云区", "en": "Yuanya School", "cn": "广州市源雅学校", "type": "民办", "grades": "小学–高中", "curriculum": "双语 + 国际课程", "website": "", "address": "广州市白云区", "fees": "民办双语价位", "notes": "源雅学校；公办质量、国际学校温度定位。", "ellen": "新兴民办双语；家长圈层在形成期。"},
    {"slug": "guangdong-overseas-chinese-high-school-international", "district": "白云区", "en": "Guangdong Overseas Chinese High School Int'l Program", "cn": "广东华侨中学国际课程中心", "type": "公立国际部", "grades": "高中", "curriculum": "AP, A-Level, DSE", "website": "https://www.gdqz.com", "address": "广州市白云区", "fees": "约 16.8 万/年", "notes": "华侨中学国际课程中心；多轨出口。", "ellen": "白云强校国际部。"},
    {"slug": "guangzhou-experimental-foreign-language-school-international", "district": "白云区", "en": "Guangzhou Experimental Foreign Language School Int'l Dept.", "cn": "广州市实验外语学校国际部", "type": "民办", "grades": "高中", "curriculum": "中加、中美、中英、中日课程", "website": "https://www.gzfls.net", "address": "广州市白云区", "fees": "约 12–14 万/年", "notes": "原广州外校附设外语学校；多国学部。", "ellen": "外语强校；口语与考试英语分层明显。"},
    {"slug": "guangzhou-no2-foreign-language-school-international", "district": "白云区", "en": "Guangzhou No.2 Foreign Language School Int'l Dept.", "cn": "广州市第二外国语学校国际部", "type": "公立国际部", "grades": "初中、高中", "curriculum": "AP", "website": "", "address": "广州市白云区", "fees": "公办国际部价位", "notes": "二外国际部。", "ellen": "外语特色公立国际部。"},
    {"slug": "zhonghuang-foreign-language-primary-baiyun", "district": "白云区", "en": "Baiyun Zhonghuang Foreign Language Primary School", "cn": "广州市白云区中黄外国语小学", "type": "民办", "grades": "小学", "curriculum": "IB PYP", "website": "https://www.izh.org", "address": "广州市白云区", "fees": "民办价位", "notes": "中黄外国语小学（白云）。", "ellen": "小学段双语；长期客户培育。"},
    # 黄埔区
    {"slug": "basis-international-school-guangzhou", "district": "黄埔区", "en": "BASIS International School Guangzhou", "cn": "广州贝赛思外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "BASIS Curriculum, AP Capstone", "website": "https://www.basisinternational.com/guangzhou", "address": "广州市黄埔区科学城", "fees": "约 28 万/年", "notes": "BASIS 集团；学术强度极高；AP Capstone 授权。", "ellen": "高学术压力；学生可能需要口语减压与结构化表达训练。"},
    {"slug": "isa-science-city-international-school", "district": "黄埔区", "en": "ISA Science City International School", "cn": "广州科学城爱莎外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "IB PYP/MYP/DP", "website": "https://www.isagz.com", "address": "广州市黄埔区科学城", "fees": "约 32.8 万/年", "notes": "爱莎科学城校区；设施新、学费高。", "ellen": "黄埔外籍家庭聚集；IB DP 学术英语。"},
    {"slug": "guangzhou-xinqiao-school", "district": "黄埔区", "en": "Guangzhou XinQiao School (SCA)", "cn": "广州新侨学校", "type": "民办", "grades": "小学–高中", "curriculum": "双语, IGCSE, A-Level, IBDP, DSE", "website": "https://www.scagz.com", "address": "广州市黄埔区", "fees": "约 18–22 万/年", "notes": "新侨学校；持外籍学校牌照的民办校；多轨制。", "ellen": "新加坡华侨背景；双语家庭多；口语与学术双线需求。"},
    {"slug": "huangpu-zhonghuang-foreign-language-experimental", "district": "黄埔区", "en": "Huangpu Zhonghuang Foreign Language Experimental School", "cn": "广州市黄埔区中黄外国语实验学校", "type": "民办", "grades": "小学、初中", "curriculum": "IB PYP/MYP", "website": "https://www.izh.org", "address": "广州市黄埔区", "fees": "民办价位", "notes": "中黄外国语实验学校（黄埔）。", "ellen": "IB 民办初中；升学衔接辅导机会。"},
    {"slug": "zhonghuang-hk-macao-taiwan-school", "district": "黄埔区", "en": "Huangpu Zhonghuang HK-Macao-Taiwan School", "cn": "广州市中黄港澳子弟学校", "type": "港澳子弟", "grades": "小学–高中", "curriculum": "IB, DSE", "website": "https://www.izh.org", "address": "广州市黄埔区", "fees": "约 18–22 万/年", "notes": "中黄港澳子弟学校；黄埔校区。", "ellen": "港澳子弟；DSE 英语与雅思交叉准备。"},
    {"slug": "huawai-tongwen-foreign-language-school", "district": "黄埔区", "en": "Huawai Tongwen Foreign Language School", "cn": "广州市黄埔区华外同文外国语学校", "type": "民办", "grades": "小学–高中", "curriculum": "IB, AP US High School", "website": "https://www.hwtf.org", "address": "广州市黄埔区", "fees": "约 15–20 万/年", "notes": "华外同文外国语学校；IB + 美式高中。", "ellen": "黄埔大型民办国际学校。"},
    {"slug": "japanese-school-of-guangzhou", "district": "黄埔区", "en": "Japanese School of Guangzhou", "cn": "广州日本人外籍人员子女学校", "type": "外籍", "grades": "小学、初中", "curriculum": "日本课程", "website": "", "address": "广州市黄埔区", "fees": "外籍学校价位", "notes": "广州日本人学校；日本国籍学生为主。", "ellen": "低优先级；除非日语背景家庭需要英语辅导。"},
    {"slug": "oisca-guangzhou-japanese-kindergarten", "district": "黄埔区", "en": "OISCA Guangzhou Japanese Kindergarten", "cn": "广州奥伊斯嘉外籍人员子女学校", "type": "外籍", "grades": "幼儿园", "curriculum": "日本幼儿课程", "website": "", "address": "广州市黄埔区", "fees": "外籍幼儿园价位", "notes": "OISCA 日本幼儿园；毗邻日本人学校。", "ellen": "幼儿段；非 Ellen 主力客群。"},
    {"slug": "harrow-international-school-guangzhou", "district": "黄埔区", "en": "Harrow International School Guangzhou", "cn": "广州哈罗外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中（规划中）", "curriculum": "British, IGCSE, A-Level", "website": "", "address": "广州市黄埔区知识城（规划）", "fees": "待定", "notes": "计划 2026 年开学；哈罗品牌进驻广州知识城。", "ellen": "待开业；可提前建立 HR/家长渠道。"},
    {"slug": "zhonghuang-academy-gia", "district": "黄埔区", "en": "Zhonghuang Academy (GIA International High School)", "cn": "中黄书院（美国GIA国际高中）", "type": "民办", "grades": "高中", "curriculum": "US GIA + AP", "website": "https://www.izh.org", "address": "广州市黄埔区", "fees": "民办国际高中价位", "notes": "中黄书院 GIA 国际高中项目。", "ellen": "美式高中路径；AP 英语与口语。"},
    # 番禺区
    {"slug": "canadian-international-school-guangzhou", "district": "番禺区", "en": "Canadian International School of Guangzhou", "cn": "广州市加拿大外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "Alberta, IB PYP, AP", "website": "https://www.cisgz.com", "address": "广州市番禺区", "fees": "约 25.8 万/年", "notes": "加拿大外籍人员子女学校；枫叶体系。", "ellen": "加拿大方向；学术英语与大学申请英语。"},
    {"slug": "guangzhou-grace-academy", "district": "番禺区", "en": "Guangzhou Grace Academy", "cn": "广州恩慧外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "A.C.E. / American Christian", "website": "", "address": "广州市番禺区", "fees": "外籍学校价位", "notes": "恩慧/恩典国际学校；基督教背景美式课程。", "ellen": "小众外籍社区。"},
    {"slug": "clifford-international-school", "district": "番禺区", "en": "Clifford International School", "cn": "广州祈福英校国际部（克勒佛国际学校）", "type": "民办", "grades": "小学–高中", "curriculum": "Manitoba Canadian", "website": "https://www.cliffordschool.org", "address": "广州市番禺区祈福新村", "fees": "约 16 万/年", "notes": "祈福英语实验学校国际部；加拿大曼尼托巴课程（外籍生）。", "ellen": "祈福大型社区；外籍与双语家庭混居。"},
    {"slug": "nas-guangzhou-panyu-nord-anglia", "district": "番禺区", "en": "NAS Guangzhou Panyu (Nord Anglia)", "cn": "广州市番禺区诺德安达学校", "type": "民办", "grades": "小学、初中", "curriculum": "双语 + Nord Anglia 课程", "website": "https://www.nordangliaeducation.com/nas-guangzhou-panyu", "address": "广州市番禺区", "fees": "约 18–22 万/年", "notes": "诺德安达番禺；双语民办。", "ellen": "番禺双语家长；初中升国际高中衔接需求。"},
    {"slug": "clifford-english-experimental-school", "district": "番禺区", "en": "Clifford English Experimental School", "cn": "广州市番禺区祈福英语实验学校", "type": "民办", "grades": "幼儿园–高中", "curriculum": "双语 + 加拿大课程", "website": "https://www.cliffordschool.org", "address": "广州市番禺区祈福新村", "fees": "约 16.2 万/年", "notes": "祈福英语实验学校本部；大型民办英语学校。", "ellen": "番禺核心生源校；家长社群活跃。"},
    {"slug": "cambridge-canada-foreign-language-school", "district": "番禺区", "en": "Cambridge CLS-C Foreign Language School", "cn": "广州市番禺区剑桥郡加拿达外国语学校", "type": "民办", "grades": "小学、初中", "curriculum": "IB PYP, 双语", "website": "", "address": "广州市番禺区剑桥郡", "fees": "民办双语价位", "notes": "剑桥郡加拿达外国语学校；IB PYP 候选。", "ellen": "番禺华南板块双语社区。"},
    {"slug": "south-china-country-garden-school", "district": "番禺区", "en": "South China Country Garden School", "cn": "华南碧桂园学校", "type": "民办", "grades": "幼儿园–高中", "curriculum": "IB + 国内课程融合", "website": "", "address": "广州市番禺区华南碧桂园", "fees": "约 12–18 万/年", "notes": "华南碧桂园学校；老牌碧桂园体系名校。", "ellen": "大型社区配套校；国际部家长基数大。"},
    {"slug": "benenden-bilingual-school-guangzhou", "district": "番禺区", "en": "Benenden Bilingual School Guangzhou", "cn": "广州市番禺区博萃德学校", "type": "民办", "grades": "幼儿园–高中", "curriculum": "双语 + 英国博萃德理念", "website": "https://www.benendengz.com", "address": "广州市番禺区", "fees": "约 32.8 万/年", "notes": "博萃德学校；英国名校博萃德合作；高端双语。", "ellen": "高端双语；家长付费意愿强。"},
    {"slug": "zhongyuan-high-school-international", "district": "番禺区", "en": "Guangdong Zhongyuan High School International Dept.", "cn": "广东仲元中学国际部", "type": "公立国际部", "grades": "高中", "curriculum": "美高 + AP", "website": "", "address": "广州市番禺区", "fees": "公办国际部价位", "notes": "仲元中学国际部；番禺顶尖公立。", "ellen": "番禺强校国际部。"},
    {"slug": "xiangxian-middle-school-international", "district": "番禺区", "en": "Xiangxian Middle School International Program", "cn": "广州市番禺区象贤中学国际班", "type": "公立国际部", "grades": "高中", "curriculum": "美高 + AP", "website": "", "address": "广州市番禺区", "fees": "约 11.8–13.8 万/年", "notes": "象贤中学国际部。", "ellen": "番禺公立国际部；性价比导向家长。"},
    {"slug": "gzu-affiliated-high-school-international", "district": "番禺区", "en": "Guangzhou University Affiliated High School Int'l College", "cn": "广州大学附属中学国际学院", "type": "公立国际部", "grades": "高中", "curriculum": "AP, 艺术, 日语", "website": "", "address": "广州市番禺区", "fees": "公办国际部价位", "notes": "广大附中附设国际学院；多轨出口。", "ellen": "广大附中品牌；国际学院分散招生。"},
    {"slug": "guangzhou-korean-school", "district": "番禺区", "en": "Guangzhou Korean School", "cn": "广州韩国外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "韩国课程", "website": "", "address": "广州市番禺区", "fees": "外籍学校价位", "notes": "广州韩国学校；韩国国籍学生为主。", "ellen": "低优先级；除非韩国家庭需要英语辅导。"},
    {"slug": "guangwai-panyu-foreign-language-school", "district": "番禺区", "en": "Guangwai Affiliated Panyu Foreign Language School", "cn": "广外附设番禺外国语学校", "type": "民办", "grades": "小学、初中", "curriculum": "双语融合", "website": "", "address": "广州市番禺区", "fees": "民办双语价位", "notes": "广外附设番禺外国语学校。", "ellen": "广外系双语；外语特色。"},
    # 花都区
    {"slug": "yew-wah-international-education-guangzhou", "district": "花都区", "en": "Yew Wah International Education School Guangzhou", "cn": "耀华国际教育学校广州校区", "type": "民办", "grades": "幼儿园–高中", "curriculum": "双语 + 国际课程", "website": "https://www.ywies-gz.com", "address": "广州市花都区", "fees": "约 26.6 万/年", "notes": "耀华国际教育学校广州校区（花都）；耀中耀华体系。", "ellen": "花都高端民办国际；寄宿生多。"},
    {"slug": "huangpuang-middle-school-international", "district": "花都区", "en": "Huangpuang Middle School International Program", "cn": "广州市黄广中学国际课程", "type": "民办", "grades": "高中", "curriculum": "剑桥 A-Level", "website": "https://www.hgzx.org", "address": "广州市花都区", "fees": "约 14.9 万/年", "notes": "黄广中学（原黄冈中学广州学校）国际课程。", "ellen": "花都大型民办；国际课程口碑传播快。"},
    # 南沙区
    {"slug": "guangzhou-foreign-language-school-ap-al", "district": "南沙区", "en": "Guangzhou Foreign Language School AP & AL", "cn": "广州外国语学校AP&AL国际课程", "type": "公立国际部", "grades": "高中", "curriculum": "AP, A-Level", "website": "https://www.gzfls.gd.cn", "address": "广州市南沙区", "fees": "约 18.8–22.8 万/年", "notes": "广州外国语学校本部（南沙）；外语类顶尖公立。", "ellen": "外语强校国际部；口语与学术双线。"},
    {"slug": "guis-ulink-international-school", "district": "南沙区", "en": "Guangzhou ULink International School (GUIS)", "cn": "广州市优联外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "K-12; ULC A-Level + NCPA AP", "website": "https://www.guis.edu.cn", "address": "广州市南沙区伟立路8号", "fees": "约 24.8 万/年", "notes": "2024 年开学；整合 ULC 与 NCPA；可招收归国留学人才子女。", "ellen": "南沙高端外籍/K12；A-Level/AP 双轨英语需求大。"},
    {"slug": "alcanta-international-college", "district": "南沙区", "en": "Alcanta International College (AIC)", "cn": "广州亚加达国际预科", "type": "民办", "grades": "高中", "curriculum": "IBDP, IGCSE, AP, A-Level", "website": "https://www.aic-gz.com", "address": "广州市南沙区", "fees": "预科价位", "notes": "亚加达国际预科 AIC；老牌预科机构；也招收国内籍学生。", "ellen": "预科/11–12年级；雅思与学术英语核心客群。"},
    {"slug": "nansha-minsheng-hk-macao-school", "district": "南沙区", "en": "Nansha Minsheng HK/Macau/Taiwan School", "cn": "广州南沙民心港人子弟学校", "type": "港澳子弟", "grades": "小学–高中", "curriculum": "DSE, IGCSE, A-Level", "website": "https://www.mssngz.com", "address": "广州市南沙区", "fees": "约 18–22 万/年", "notes": "民心港人子弟学校；港人背景校长；大湾区重点学校。", "ellen": "港人子弟；DSE 英语口语与雅思高度重叠。"},
    {"slug": "jnu-affiliated-hk-macao-school-nansha", "district": "南沙区", "en": "ASJ for HK & Macao Students (Yingdong Campus)", "cn": "广州暨大港澳子弟学校（南沙英东校区）", "type": "港澳子弟", "grades": "幼儿园–高中", "curriculum": "IB, DSE, A-Level", "website": "https://www.asjgz.com", "address": "广州市南沙区", "fees": "约 15–22 万/年", "notes": "暨大港澳子弟学校南沙校区。", "ellen": "港澳子弟第二条校区；同上。"},
    {"slug": "beipei-senior-high-dse-international", "district": "南沙区", "en": "Beipei Senior High School DSE International Dept.", "cn": "广州市北培高级中学DSE国际部", "type": "民办", "grades": "高中", "curriculum": "DSE", "website": "", "address": "广州市南沙区", "fees": "民办 DSE 价位", "notes": "北培高级中学 DSE 国际部。", "ellen": "DSE 国际部；英语口语刚需。"},
    # 增城区
    {"slug": "utahloy-international-school-zengcheng", "district": "增城区", "en": "Utahloy International School Zengcheng", "cn": "广州增城誉德莱外籍人员子女学校", "type": "外籍", "grades": "幼儿园–高中", "curriculum": "IB PYP/MYP/DP", "website": "https://www.uisgz.com", "address": "广州市增城区", "fees": "约 16.5–23.5 万/年", "notes": "誉德莱增城校区；可寄宿；环境好。", "ellen": "寄宿外籍校；家长可能远程关注孩子英语辅导。"},
    {"slug": "fettes-college-guangzhou", "district": "增城区", "en": "Fettes College Guangzhou", "cn": "广州市斐特思学校", "type": "民办", "grades": "幼儿园–高中", "curriculum": "IB, A-Level, 艺术", "website": "https://www.fettes.cn", "address": "广州市增城区", "fees": "约 13.25 万/学期", "notes": "斐特思学校；英国斐特思公学合作；IB + A-Level。", "ellen": "增城高端民办；全寄宿选项。"},
    {"slug": "xiangjiang-middle-school-international", "district": "增城区", "en": "Guangzhou Xiangjiang Middle School International Dept.", "cn": "广州市香江中学国际部", "type": "民办", "grades": "高中", "curriculum": "DSE, IGCSE, AP, A-Level", "website": "https://www.gzxj.com", "address": "广州市增城区", "fees": "约 4.4–6.9 万/学期", "notes": "香江中学国际部；老牌民办；多轨制。", "ellen": "增城大型民办；国际部学费相对亲民。"},
    {"slug": "phoenix-city-international-school", "district": "增城区", "en": "Phoenix City International School", "cn": "广州市增城区凤凰城中英文学校", "type": "民办", "grades": "幼儿园–高中", "curriculum": "IB PYP/MYP + 双语", "website": "", "address": "广州市增城区凤凰城", "fees": "民办双语价位", "notes": "凤凰城中英文学校；大型社区配套。", "ellen": "凤凰城社区；家长群活跃。"},
    {"slug": "gzist-experimental-school-international", "district": "增城区", "en": "GZIST Experimental School International Dept.", "cn": "广州理工实验学校国际部", "type": "民办", "grades": "高中", "curriculum": "DSE", "website": "", "address": "广州市增城区", "fees": "民办价位", "notes": "广州理工实验学校国际部；DSE 方向。", "ellen": "DSE 民办国际部。"},
    # 从化区
    {"slug": "leinasen-yinhao-international-college", "district": "从化区", "en": "Leinasen Yinhao International College", "cn": "雷纳森英豪国际学院", "type": "民办", "grades": "高中", "curriculum": "AP, A-Level", "website": "", "address": "广州市从化区", "fees": "约 7.9–10.4 万/年", "notes": "雷纳森英豪国际学院（从化）；广附英豪体系；可寄宿。", "ellen": "从化寄宿国际学院；学术英语与升学辅导。"},
]

RESEARCH_TEMPLATE = """# {en}

**中文名：** {cn}  
**所在区：** {district}  
**类型：** {type}  
**学段：** {grades}  
**课程体系：** {curriculum}

## 概况

{notes}

## 联系与地址

| 项目 | 信息 |
|------|------|
| 官网 | {website} |
| 地址 | {address} |
| 学费参考 | {fees} |

## Ellen English Studio 触达备注

{ellen}

## 待核实

- [ ] 确认当前招生学段与课程是否有变动
- [ ] 核实最新学费与入学要求
- [ ] 记录招生办电话 / 邮箱（官网查询）

## 来源

- 广州市教育局外籍人员子女学校名单（2025-03）
- 国际教育前线 / 100国际学校招生区划盘点
- international-schools-database.com Guangzhou listing
- 学校官网（如有）

*调研整理：SophiaW · {date} · 供 Ellen English Studio 学校触达参考*
"""


def main():
    from datetime import date
    today = date.today().isoformat()
    count = 0
    districts = {}

    for s in SCHOOLS:
        folder = ROOT / s["slug"]
        folder.mkdir(parents=True, exist_ok=True)
        content = RESEARCH_TEMPLATE.format(
            en=s["en"],
            cn=s["cn"],
            district=s["district"],
            grades=s["grades"],
            type=s["type"],
            curriculum=s["curriculum"],
            notes=s["notes"],
            website=s["website"] or "（待查官网）",
            address=s["address"],
            fees=s["fees"],
            ellen=s["ellen"],
            date=today,
        )
        (folder / "RESEARCH.md").write_text(content, encoding="utf-8")
        districts.setdefault(s["district"], []).append(s)
        count += 1

    # README index
    readme_lines = [
        "# 广州国际学校调研档案",
        "",
        "Ellen English Studio 学校触达用参考资料。每校一个文件夹，内含 `RESEARCH.md`。",
        "",
        f"**学校总数：** {count} 所（含外籍人员子女学校、港澳子弟学校、民办国际化学校、公立国际部）",
        "",
        f"*最后更新：{today} · SophiaW*",
        "",
        "## 说明",
        "",
        "- **外籍** = 外籍人员子女学校（外国护照 / 港澳台 / 部分含归国留学人才子女）",
        "- **港澳子弟** = 港澳子弟学校",
        "- **公立国际部** = 公办学校国际课程中心 / 国际部",
        "- 学费为公开资料参考价，入学前务必核实官网",
        "- 不含佛山、东莞等周边城市学校（如广东碧桂园学校佛山校区、QSI Dongguan 等）",
        "",
        "## 按区索引",
        "",
    ]
    district_order = [
        "荔湾区", "越秀区", "海珠区", "天河区", "白云区",
        "黄埔区", "番禺区", "花都区", "南沙区", "增城区", "从化区",
    ]
    for d in district_order:
        if d not in districts:
            continue
        readme_lines.append(f"### {d} ({len(districts[d])} 所)")
        readme_lines.append("")
        for s in districts[d]:
            readme_lines.append(f"- [{s['cn']}]({s['slug']}/RESEARCH.md) — {s['en']}")
        readme_lines.append("")

    readme_lines.extend([
        "## 官方参考",
        "",
        "- [广州市外籍人员子女学校、港澳子弟学校名单（教育局 2025-03）](https://jyj.gz.gov.cn/yw/tzgg/content/post_10161199.html)",
        "- [International Schools Database — Guangzhou](https://www.international-schools-database.com/in/guangzhou)",
        "",
        "## Ellen 优先触达（高匹配）",
        "",
        "按 `target-audience.md` 家长画像，建议优先：",
        "",
        "- 天河：汇景新城实验小学、华附国际部、暨大港澳子弟学校、天省国际部",
        "- 越秀：执信二沙国际校区",
        "- 外籍校：AISG、BSG、BASIS、爱莎各校、GUIS",
        "- 港澳子弟 / DSE：民心、暨大港澳、中黄港澳",
        "- 预科：亚加达 AIC",
    ])

    (ROOT / "README.md").write_text("\n".join(readme_lines), encoding="utf-8")

    # JSON index
    index = [
        {k: v for k, v in s.items() if k != "notes" and k != "ellen"}
        for s in SCHOOLS
    ]
    (ROOT / "schools-index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"Created {count} school folders under {ROOT}")


if __name__ == "__main__":
    main()
