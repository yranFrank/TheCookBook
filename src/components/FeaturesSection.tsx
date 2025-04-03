'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const features = [
  {
    title: '添加菜谱',
    href: '/add-recipe',
    explanation: '自定义上传你喜欢的菜品',
    image: '/images/feature1.jpg',
  },
  {
    title: '本周菜篮子',
    href: '/basket',
    explanation: '查看和编辑你的菜篮',
    image: '/images/feature2.jpg',
  },
  {
    title: '本周菜单',
    href: '/menu-plan',
    explanation: '管理一周菜单',
    image: '/images/feature3.jpg',
  },
  {
    title: '账户设置',
    href: '/settings',
    explanation: '管理账户和偏好设置',
    image: '/images/feature4.jpg',
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-[#f0e0c8] py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative h-[400px] rounded-[16px] overflow-hidden border border-[#d7c9ac] bg-cover bg-center shadow-sm"
            style={{
              backgroundImage: `url(${feature.image})`,
            }}
          >
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl md:text-3xl font-light">
                {feature.title}
              </h3>
              <p className="text-sm mt-2 opacity-90">{feature.explanation}</p>
              <Link
                href={feature.href}
                className="mt-4 inline-flex items-center gap-1 text-sm hover:underline"
              >
                <span className="text-lg">→</span> Learn more
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
