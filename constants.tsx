
import { TFTSite } from './types';

export const TFT_SITES: TFTSite[] = [
  {
    id: 'metatft',
    name: 'MetaTFT',
    url: 'https://www.metatft.com/comps',
    description: '实时英雄与羁绊胜率统计，最权威的数据网站。',
    icon: '📊',
    category: 'Stats'
  },
  {
    id: 'tftable',
    name: 'TFTTable',
    url: 'https://tftable.cc',
    description: '国内备受欢迎的云顶速查表，包含装备合成、阵容推荐及棋子属性。',
    icon: '📋',
    category: 'Database'
  },
  {
    id: 'tactics-tools',
    name: 'Tactics.tools',
    url: 'https://tactics.tools/zh',
    description: '深度分析个人战绩、单位强度及装备搭配。',
    icon: '🔧',
    category: 'Stats'
  },
  {
    id: 'lolchess',
    name: 'LoLChess',
    url: 'https://lolchess.gg/',
    description: '阵容模拟器及全球玩家战绩查询。',
    icon: '♟️',
    category: 'Database'
  },
  {
    id: 'mobalytics',
    name: 'Mobalytics',
    url: 'https://app.mobalytics.gg/tft/team-comps',
    description: '专家撰写的详细阵容攻略与运营思路。',
    icon: '💡',
    category: 'Guides'
  },
  {
    id: 'tftactics',
    name: 'TFTactics',
    url: 'https://tftactics.gg/tierlist/team-comps',
    description: '即时的S级阵容排行及物品合成图。',
    icon: '🗺️',
    category: 'Guides'
  },
  {
    id: 'reddit-competitive',
    name: 'Reddit CompetitiveTFT',
    url: 'https://www.reddit.com/r/CompetitiveTFT/',
    description: '高端玩家讨论区，版本解读的第一手来源。',
    icon: '💬',
    category: 'Social'
  }
];

export const THEME_COLORS = {
  primary: '#C89B3C', // TFT Gold
  secondary: '#00CFBC', // Hextech Cyan
  background: '#091428', // League Deep Blue
  surface: '#111827',
  accent: '#785A28'
};
