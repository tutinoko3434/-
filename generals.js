

const generalsData = [
    
    {
        id: "tsugaru",
        name: "津軽",
        color: "#4682b4",
        ownedCastles: [6],
        officers: [
            { name: "津軽為信", title: "津軽の梟雄", combat: 82 },
            { name: "沼田祐光", title: "陰陽流の軍師", combat: 71 }
        ]
    },
    {
        id: "nanbu",
        name: "南部",
        color: "#00ffff",
        ownedCastles: [2, 4],
        officers: [
            { name: "南部晴政", title: "三日月の丸くなるまで南部領", combat: 84 },
            { name: "石川高信", title: "津軽平定の祖", combat: 79 }
        ]
    },
    {
        id: "ando",
        name: "安東",
        color: "#e0b0ff",
        ownedCastles: [5],
        officers: [
            { name: "安東愛季", title: "斗星の北天に在るに同じ", combat: 76 }
        ]
    },
    {
        id: "mogami",
        name: "最上",
        color: "#ff7f50",
        ownedCastles: [8],
        officers: [
            { name: "最上義光", title: "出羽の驍将", combat: 93 },
            { name: "氏家守棟", title: "最上の智嚢", combat: 65 }
        ]
    },
    {
        id: "date",
        name: "伊達",
        color: "#1e90ff",
        ownedCastles: [9, 11],
        officers: [
            { name: "伊達輝宗", title: "奥州の総大将", combat: 78 },
            { name: "鬼庭良直", title: "評定衆筆頭", combat: 85 },
            { name: "伊達政宗", title: "奥州の独眼竜", combat: 96, maxSoldiers: 10000 },
            { name: "片倉小十郎", title: "竜の右目", combat: 88 },
            { name: "伊達成実", title: "英毅大勇の武闘派", combat: 92 }
        ]
    },

    
    {
        id: "utsunomiya",
        name: "宇都宮",
        color: "#bcc132",
        ownedCastles: [13],
        officers: [
            { name: "宇都宮広綱", title: "過酷なる下野を生き抜く主", combat: 82 },
            { name: "芳賀高定", title: "主家を支えし忠義の智臣", combat: 78 }
        ]
    },
    {
        id: "satake",
        name: "佐竹",
        color: "#ff007f",
        ownedCastles: [25],
        officers: [
            { name: "佐竹義重", title: "坂東太郎", combat: 93 },
            { name: "和田昭為", title: "佐竹の宿老", combat: 68 }
        ]
    },
    {
        id: "hojo",
        name: "北条",
        color: "#ffff00",
        ownedCastles: [14, 15, 17, 18, 19, 22, 23],
        officers: [
            { name: "北条氏康", title: "相模の獅子", combat: 95, maxSoldiers: 10000 },
            { name: "北条綱成", title: "地黄八幡", combat: 97 },
            { name: "北条氏政", title: "汁かけ飯の逸話", combat: 70 },
            { name: "北条氏照", title: "武蔵の守護者・八王子城主", combat: 86 },
            { name: "北条氏邦", title: "鉢形城に聳える頑固一徹の将", combat: 88 },
            { name: "北条幻庵", title: "五代に仕えた北条の長老", combat: 74, maxSoldiers: 4000},
            { name: "清水康英", title: "伊豆水軍を率いる下田城主", combat: 81 },
            { name: "風魔小太郎", title: "相模の闇に潜む乱波の長", combat: 94, maxSoldiers: 1000, currentSoldiers: 500 }
        ]
    },
    {
        id: "satomi",
        name: "里見",
        color: "#00f5ff",
        ownedCastles: [20, 21],
        officers: [
            { name: "里見義堯", title: "房総の正義の将", combat: 86 },
            { name: "里見義弘", title: "国府台の激闘", combat: 84 }
        ]
    },

    
    {
        id: "uesugi",
        name: "上杉",
        color: "#a6e22e",
        ownedCastles: [7, 10, 26, 27],
        officers: [
            { name: "上杉謙信", title: "軍神 / 越後の虎", combat: 100, maxSoldiers: 10000 },
            { name: "直江景綱", title: "上杉の執政", combat: 72 },
            { name: "柿崎景家", title: "越後第一の猛将", combat: 98 },
            { name: "宇佐美定満", title: "軍師の鑑", combat: 75, maxSoldiers: 4000 },
            { name: "村上義清", title: "信玄を二度破った猛将", combat: 95 },
            { name: "甘粕景持", title: "殿の殿", combat: 90 },
            { name: "新発田重家", title: "意地を通した反骨の将", combat: 87 }
        ]
    },
    {
        id: "takeda",
        name: "武田",
        color: "#ff3333",
        ownedCastles: [16, 28, 29, 30, 31, 32, 33],
        officers: [
            { name: "武田信玄", title: "甲斐の虎", combat: 96, maxSoldiers: 10000 },
            { name: "山県昌景", title: "赤備えの猛将", combat: 97 },
            { name: "真田幸隆", title: "攻弾正", combat: 85 },
            { name: "馬場信春", title: "不死身の鬼美濃", combat: 95 },
            { name: "高坂昌信", title: "逃げ弾正", combat: 82 },
            { name: "山本勘助", title: "隻眼の軍師", combat: 70, maxSoldiers: 4000 },
            { name: "真田昌幸", title: "表裏比興の者", combat: 88 },
            { name: "真田信之", title: "真田の血脈を繋ぐ者", combat: 80 },
            { name: "真田信繁", title: "日本一の兵", combat: 99, maxSoldiers: 5000 }
        ]
    },
    {
        id: "imagawa",
        name: "今川",
        color: "#da70d6",
        ownedCastles: [40, 41, 42, 43, 44],
        officers: [
            { name: "今川義元", title: "東海一の弓取り", combat: 82, maxSoldiers: 10000, currentSoldiers: 5000 },
            { name: "太原雪斎", title: "黒衣の宰相", combat: 74 },
            { name: "今川氏真", title: "蹴鞠と和歌を愛した風雅の主", combat: 52 },
            { name: "岡部元信", title: "高天神城を死守せし不屈の猛将", combat: 86 },
            { name: "朝比奈泰朝", title: "掛川城で最後まで戦い抜いた忠臣", combat: 83 },
            { name: "鵜殿長照", title: "上ノ郷城を守りし義元の義弟", combat: 75 },
            { name: "瀬名氏俊", title: "桶狭間の前哨戦を指揮せし重臣", combat: 70 }
        ]
    },
    {
        id: "jinbo",
        name: "神保",
        color: "#f0e68c",
        ownedCastles: [35],
        officers: [
            { name: "神保長職", title: "越中の風雲を望む", combat: 66 }
        ]
    },
    {
        id: "shimoduma",
        name: "下間",
        color: "#ff00ff",
        ownedCastles: [36, 37],
        officers: [
            { name: "下間頼廉", title: "大坂之左右之大将", combat: 89 }
        ]
    },
    {
        id: "asakura",
        name: "朝倉",
        color: "#ffa500",
        ownedCastles: [38],
        officers: [
            { name: "朝倉義景", title: "越前の名門", combat: 72 },
            { name: "朝倉宗滴", title: "軍神の教え", combat: 93 },
            { name: "明智光秀", title: "金ヶ崎の殿軍", combat: 88, maxSoldiers: 4000 }
        ]
    },

    
    {
        id: "oda",
        name: "織田",
        color: "#00ff7f",
        ownedCastles: [34, 46, 49],
        officers: [
            { name: "織田信長", title: "尾張の風雲児", combat: 96, maxSoldiers: 10000 },
            { name: "柴田勝家", title: "鬼柴田", combat: 96, maxSoldiers: 4000, currentSoldiers: 500 },
            { name: "羽柴秀吉", title: "木下藤吉郎", combat: 82, maxSoldiers: 6000, currentSoldiers: 500 },
            { name: "丹羽長秀", title: "米五郎左", combat: 81, currentSoldiers: 500 },
            { name: "滝川一益", title: "進むも退くも滝川", combat: 88, currentSoldiers: 500 },
            { name: "佐々成政", title: "北アルプスを越えた黒百合の将", combat: 85, currentSoldiers: 500 },
            { name: "前田利家", title: "槍の又左", combat: 89, currentSoldiers: 500 },
            { name: "池田恒興", title: "信玄・勝頼と渡り合った宿老", combat: 80, currentSoldiers: 500 },
            { name: "森長可", title: "鬼武蔵", combat: 94, maxSoldiers: 1000, currentSoldiers: 500 }
        ]
    },
    {
        id: "tokugawa",
        name: "松平",
        color: "#00bfff",
        ownedCastles: [45],
        officers: [
            { name: "松平元康", title: "三河の苦労人", combat: 88, maxSoldiers: 6000 },
            { name: "本多忠勝", title: "東国無双の勇士", combat: 150, maxSoldiers: 500, currentSoldiers: 500 },
            { name: "榊原康政", title: "徳川四天王の知恵袋", combat: 90, maxSoldiers: 1000, currentSoldiers: 500 },
            { name: "井伊直政", title: "井伊の赤鬼", combat: 96, maxSoldiers: 4000, currentSoldiers: 500 },
            { name: "酒井忠次", title: "徳川四天王の筆頭", combat: 89, maxSoldiers: 1000, currentSoldiers: 500 },
            { name: "服部半蔵", title: "伊賀の忍び", combat: 92, maxSoldiers: 500, currentSoldiers: 500 }
        ]
    },
    {
        id: "saito",
        name: "斎藤",
        color: "#ba55d3",
        ownedCastles: [47, 48],
        officers: [
            { name: "斎藤義龍", title: "美濃の巨漢", combat: 88 },
            { name: "竹中半兵衛", title: "今孔明", combat: 71, maxSoldiers: 4000, currentSoldiers: 500 }
        ]
    },
    {
        id: "azai",
        name: "浅井",
        color: "#7fffd4",
        ownedCastles: [51, 52],
        officers: [
            { name: "浅井長政", title: "江北の若鷹", combat: 91 },
            { name: "磯野員昌", title: "姉川の三田村破り", combat: 88 },
            { name: "遠藤直経", title: "義に殉じた知勇の将", combat: 84 }
        ]
    },
    {
        id: "rokkaku",
        name: "六角",
        color: "#ffe4b5",
        ownedCastles: [53],
        officers: [
            { name: "六角義賢", title: "江南の佐々木", combat: 73 }
        ]
    },
    {
    id: "tsutsui",
    name: "筒井",
    color: "#8b4513",
    ownedCastles: [57,108], 
    officers: [
        { name: "筒井順慶", title: "大和の洞ヶ峠", combat: 75 },
        { name: "島左近", title: "三成に過ぎたるもの", combat: 96 }
    ]
    },
    {
        id: "suzuki",
        name: "鈴木",
        color: "#6a6a6a",
        ownedCastles: [58], 
        officers: [
            { name: "鈴木孫一", title: "雑賀鉢かぶりの鉄砲頭", combat: 95 },
            { name: "土橋守重", title: "雑賀三人衆の筆頭格", combat: 81 }
        ]
    },
    {
        id: "ashikaga",
        name: "足利",
        color: "#ffffff",
        ownedCastles: [55],
        officers: [
            { name: "足利義輝", title: "剣豪将軍", combat: 97 },
            { name: "足利義昭", title: "室町幕府最後の放浪公方", combat: 58 },
            { name: "細川藤孝", title: "古今伝授を受けし文武両道の古強者", combat: 84 },
            { name: "三淵藤英", title: "幕府に殉じた義輝・義昭の側近", combat: 78 },
            { name: "和田惟政", title: "公方暗殺を切り抜けた甲賀の志士", combat: 75 },
            { name: "一色藤長", title: "義輝・義昭の2代に尽くした奉公众", combat: 67 }
        ]
    },
    {
        id: "isshiki",
        name: "一色",
        color: "#4682b4",
        ownedCastles: [101, 105],
        officers: [
            { name: "一色義道", title: "丹後に割拠せし四職の名門", combat: 68 },
            { name: "一色義定", title: "弓木城に散った最後の当主", combat: 73 },
            { name: "延永長信", title: "主家を支えた丹後の宿老", combat: 65 }
        ]
    },
    {
        id: "miyoshi",
        name: "三好",
        color: "#adff2f",
        ownedCastles: [59, 60, 61, 109],
        officers: [
            { name: "三好長慶", title: "日本の主たる人", combat: 83 }
        ]
    },
    {
        id: "hatano",
        name: "波多野",
        color: "#8e44ad",
        ownedCastles: [107, 110],
        officers: [
            { name: "波多野秀治", title: "丹波の波多野首", combat: 72 }
        ]
    },

    
    {
        id: "amago",
        name: "尼子",
        color: "#ff69b4",
        ownedCastles: [64, 66, 102, 106, 111, 112],
        officers: [
            { name: "尼子義久", title: "新宮党粛清の陰で", combat: 60, maxSoldiers: 10000 },
            { name: "山中鹿介", title: "願わくば我に七難八苦を", combat: 95 }
        ]
    },
    {
        id: "akamatsu",
        name: "赤松",
        color: "#e6a8d7",
        ownedCastles: [62, 63],
        officers: [
            { name: "黒田官兵衛", title: "播磨の若き天才軍師", combat: 64 }
        ]
    },
    {
        id: "uragami",
        name: "浦上",
        color: "#40e0d0",
        ownedCastles: [67, 69],
        officers: [
            { name: "宇喜多直家", title: "暗殺の巨匠", combat: 74 }
        ]
    },
    {
        id: "mori",
        name: "毛利",
        color: "#32cd32",
        ownedCastles: [68, 70, 71, 72, 73, 74, 103, 104],
        officers: [
            { name: "毛利元就", title: "稀代の謀神", combat: 86 },
            { name: "吉川元春", title: "不敗の剛将", combat: 98 },
            { name: "小早川隆景", title: "毛利の両川", combat: 78 },
            { name: "村上元吉", title: "能島村上水軍の将", combat: 89 }
        ]
    },
    {
        id: "hachisuka",
        name: "蜂須賀",
        color: "#ff4500",
        ownedCastles: [75],
        officers: [
            { name: "蜂須賀家政", title: "阿波連島を開拓せし者", combat: 76 }
        ]
    },
    {
        id: "miyoshi_s",
        name: "十河",
        color: "#df73ff",
        ownedCastles: [76, 77],
        officers: [
            { name: "十河一存", title: "鬼十河", combat: 92 }
        ]
    },
    {
        id: "kouchi",
        name: "河野",
        color: "#fafad2",
        ownedCastles: [79],
        officers: [
            { name: "村上武吉", title: "瀬戸内海の海賊王", combat: 92 }
        ]
    },
    {
        id: "chosokabe",
        name: "長宗我部",
        color: "#d800c4",
        ownedCastles: [78, 80],
        officers: [
            { name: "長宗我部元親", title: "土佐の出来人", combat: 93 }
        ]
    },

    
    {
        id: "otomo",
        name: "大友",
        color: "#00ffff",
        ownedCastles: [81, 82, 90, 91, 92, 93],
        officers: [
            { name: "大友宗麟", title: "豊後の王", combat: 83, maxSoldiers: 8000 },
            { name: "立花道雪", title: "雷神の化身", combat: 98 },
            { name: "高橋紹運", title: "岩屋城の忠臣", combat: 95 },
            { name: "吉弘鎮信", title: "大友の猛将", combat: 87 }
        ]
    },
    {
        id: "ryuzoji",
        name: "龍造寺",
        color: "#ffd700",
        ownedCastles: [84, 85, 86, 87, 89],
        officers: [
            { name: "龍造寺隆信", title: "肥前の熊", combat: 90, maxSoldiers: 6000 },
            { name: "鍋島直茂", title: "肥前の狐", combat: 92, maxSoldiers: 4000 }
        ]
    },
    {
        id: "shimazu",
        name: "島津",
        color: "#ff1493",
        ownedCastles: [94, 95, 97, 98, 100],
        officers: [
            { name: "島津貴久", title: "薩摩の英主", combat: 84 },
            { name: "島津義久", title: "島津四兄弟の長兄", combat: 92, maxSoldiers: 6000 },
            { name: "島津義弘", title: "鬼石曼子", combat: 100},
            { name: "島津歳久", title: "いざ白雲の上", combat: 88},
            { name: "島津家久", title: "釣り野伏の天才", combat: 97 },
            { name: "伊集院忠棟", title: "島津の外交家", combat: 65 }
        ]
    },
    {
        id: "itoshishima", 
        name: "伊東",
        color: "#dda0dd",
        ownedCastles: [96],
        officers: [
            { name: "伊東義祐", title: "日向の栄華を築いた主", combat: 68 },
            { name: "伊東祐兵", title: "飫肥藩の祖", combat: 73 }
        ]
    },

    
    {
        id: "kansen",
        name: "観戦",
        color: "#e0e0e0",
        ownedCastles: [],
        officers: [
            { name: "観戦", title: "すべてを知るもの", combat: 100 }
        ]
    },
    {
        id: "ronin",
        name: "中立・国人衆",
        color: "#e0e0e0",
        ownedCastles: [],
        officers: [
            { name: "国人衆", title: "地元の豪族", combat: 50 }
        ]
    }
];