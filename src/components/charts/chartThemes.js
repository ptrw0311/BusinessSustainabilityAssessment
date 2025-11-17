// 圖表主題配置
export const chartThemes = {
  // 現代化深色主題
  modern: {
    background: 'transparent',
    grid: {
      stroke: 'var(--neutral-200)',
      strokeDasharray: '3 3',
      opacity: 0.6
    },
    axis: {
      stroke: 'var(--neutral-400)',
      fontSize: 12,
      fontFamily: 'Inter, sans-serif',
      fill: 'var(--neutral-600)'
    },
    tooltip: {
      backgroundColor: 'var(--neutral-0)',
      border: '1px solid var(--neutral-200)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      color: 'var(--neutral-800)',
      fontSize: 14,
      fontFamily: 'Inter, sans-serif',
      padding: '12px 16px'
    },
    legend: {
      fontSize: 14,
      fontFamily: 'Inter, sans-serif',
      fill: 'var(--neutral-700)'
    }
  },

  // 雷達圖專用配置
  radar: {
    grid: {
      gridType: 'polygon',
      stroke: 'var(--neutral-300)',
      strokeWidth: 1,
      fill: 'var(--primary-50)',
      fillOpacity: 0.1
    },
    angle: {
      tick: {
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
        fill: 'var(--neutral-700)',
        fontWeight: 500
      },
      tickFormatter: (value) => value.length > 8 ? `${value.slice(0, 6)}...` : value
    },
    radius: {
      angle: 90,
      domain: [0, 100],
      tick: {
        fontSize: 11,
        fill: 'var(--neutral-500)'
      }
    }
  },

  // 效能評級顏色方案
  performanceColors: {
    excellent: 'var(--success-500)',    // 優異 - 綠色
    good: '#10b981',                    // 良好 - 淺綠
    average: 'var(--warning-500)',      // 一般 - 黃色  
    poor: '#fb923c',                    // 待改善 - 橘色
    risk: 'var(--error-500)'           // 風險 - 紅色
  },

  // 維度主題色彩
  dimensionColors: {
    營運能力: {
      primary: 'var(--primary-500)',
      light: 'var(--primary-200)',
      gradient: 'linear-gradient(135deg, var(--primary-400) 0%, var(--primary-600) 100%)'
    },
    財務能力: {
      primary: 'var(--success-500)', 
      light: 'var(--success-200)',
      gradient: 'linear-gradient(135deg, var(--success-400) 0%, var(--success-600) 100%)'
    },
    未來力: {
      primary: 'var(--secondary-500)',
      light: 'var(--secondary-200)', 
      gradient: 'linear-gradient(135deg, var(--secondary-400) 0%, var(--secondary-600) 100%)'
    },
    AI數位力: {
      primary: '#6366f1',
      light: '#c7d2fe',
      gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)'
    },
    ESG永續力: {
      primary: '#059669',
      light: '#a7f3d0',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    創新能力: {
      primary: '#dc2626',
      light: '#fecaca', 
      gradient: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)'
    }
  },

  // 圖表動畫配置
  animations: {
    radar: {
      animationBegin: 0,
      animationDuration: 1000,
      animationEasing: 'ease-out'
    },
    bar: {
      animationBegin: 100,
      animationDuration: 800,
      animationEasing: 'ease-in-out'
    },
    line: {
      animationBegin: 200,
      animationDuration: 1200,
      animationEasing: 'ease-out'
    },
    pie: {
      animationBegin: 0,
      animationDuration: 1000,
      animationEasing: 'ease-out'
    }
  }
};

// 工具函數：根據分數獲取效能顏色
export const getPerformanceColor = (score) => {
  if (score >= 90) return chartThemes.performanceColors.excellent;
  if (score >= 80) return chartThemes.performanceColors.good;
  if (score >= 70) return chartThemes.performanceColors.average;
  if (score >= 60) return chartThemes.performanceColors.poor;
  return chartThemes.performanceColors.risk;
};

// 工具函數：根據維度名稱獲取顏色
export const getDimensionColor = (dimension, type = 'primary') => {
  return chartThemes.dimensionColors[dimension]?.[type] || 'var(--primary-500)';
};

// 雷達圖預設配置
export const defaultRadarProps = {
  outerRadius: 120,
  fill: 'var(--primary-400)',
  fillOpacity: 0.3,
  stroke: 'var(--primary-600)',
  strokeWidth: 2,
  dot: {
    fill: 'var(--primary-600)',
    strokeWidth: 2,
    r: 4
  }
};

// Tooltip 自定義樣式
export const customTooltipStyle = {
  backgroundColor: 'var(--neutral-0)',
  border: '1px solid var(--neutral-200)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-xl)',
  padding: '12px 16px',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  color: 'var(--neutral-800)'
};

// 響應式容器預設配置
export const responsiveContainerProps = {
  width: '100%',
  height: 400,
  debounce: 50
};