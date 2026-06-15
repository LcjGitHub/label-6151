import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PieChart from '@/components/PieChart.vue'

const mockData = [
  { label: '唐朝', value: 10, ratio: 50 },
  { label: '宋朝', value: 6, ratio: 30 },
  { label: '明朝', value: 4, ratio: 20 },
]

describe('PieChart.vue', () => {
  it('should render correctly with data', () => {
    const wrapper = mount(PieChart, {
      props: {
        data: mockData,
        title: '朝代分布',
      },
    })
    expect(wrapper.find('.pie-chart').exists()).toBe(true)
    expect(wrapper.find('.pie-chart__title').text()).toBe('朝代分布')
    expect(wrapper.findAll('.pie-chart__slice')).toHaveLength(3)
    expect(wrapper.findAll('.pie-chart__legend-item')).toHaveLength(3)
  })

  it('should render legend labels and values correctly', () => {
    const wrapper = mount(PieChart, {
      props: {
        data: mockData,
      },
    })
    const legendItems = wrapper.findAll('.pie-chart__legend-item')
    expect(legendItems[0].find('.pie-chart__legend-label').text()).toBe('唐朝')
    expect(legendItems[0].find('.pie-chart__legend-value').text()).toBe('50%')
    expect(legendItems[1].find('.pie-chart__legend-label').text()).toBe('宋朝')
    expect(legendItems[1].find('.pie-chart__legend-value').text()).toBe('30%')
  })

  it('should handle empty data', () => {
    const wrapper = mount(PieChart, {
      props: {
        data: [],
      },
    })
    expect(wrapper.find('.pie-chart').exists()).toBe(true)
    expect(wrapper.findAll('.pie-chart__slice')).toHaveLength(0)
    expect(wrapper.findAll('.pie-chart__legend-item')).toHaveLength(0)
  })

  it('should use custom colors when provided', () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff']
    const wrapper = mount(PieChart, {
      props: {
        data: mockData,
        colors: customColors,
      },
    })
    const dots = wrapper.findAll('.pie-chart__legend-dot')
    expect(dots[0].attributes('style')).toContain('rgb(255, 0, 0)')
    expect(dots[1].attributes('style')).toContain('rgb(0, 255, 0)')
    expect(dots[2].attributes('style')).toContain('rgb(0, 0, 255)')
  })

  it('should set correct aria label', () => {
    const wrapper = mount(PieChart, {
      props: {
        data: mockData,
        title: '朝代分布',
      },
    })
    const figure = wrapper.find('.pie-chart')
    expect(figure.attributes('aria-label')).toContain('饼图')
    expect(figure.attributes('aria-label')).toContain('朝代分布')
  })
})
