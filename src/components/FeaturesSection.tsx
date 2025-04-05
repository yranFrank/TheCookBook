'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

const features = [
  {
    title: '添加菜谱',
    href: '/add-recipe',
    explanation: '你可以自定义上传喜爱的菜品，与家人共享一周美味计划！',
    image:
      'https://firebasestorage.googleapis.com/v0/b/whatsfordinner-6918d.firebasestorage.app/o/feature1.jpg?alt=media&token=55bfc0a7-add2-4dfd-a56e-04b266881907',
  },
  {
    title: '本周菜篮子',
    href: '/basket',
    explanation: '集中查看和编辑你本周计划采购的食材，一键搞定购物清单。',
    image:
      'https://firebasestorage.googleapis.com/v0/b/whatsfordinner-6918d.firebasestorage.app/o/feature2.jpg?alt=media&token=78190b50-ba31-4198-bc7a-a92d9ae5b3b2',
  },
  {
    title: '本周菜单',
    href: '/menu-plan',
    explanation: '直观管理你的三餐搭配，灵活调整，营养均衡又高效。',
    image:
      'https://firebasestorage.googleapis.com/v0/b/whatsfordinner-6918d.firebasestorage.app/o/feature3.jpg?alt=media&token=43b6ba86-80d6-48e0-a1aa-7edb37b7a566',
  },
  {
    title: '账户设置',
    href: '/settings',
    explanation: '设置你的口味偏好、分享权限，与家人一同计划每周美食。',
    image:
      'https://firebasestorage.googleapis.com/v0/b/whatsfordinner-6918d.firebasestorage.app/o/feature4.jpg?alt=media&token=e6a6ecba-26d6-4c3f-9e32-d929f7b679f3',
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-[#f0e0c8] py-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-24">
        {features.map((feature, idx) => {
          const isEven = idx % 2 === 0

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className={`flex flex-col-reverse lg:flex-row items-center gap-10 ${
                !isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Note/Explanation */}
              <motion.div
                className="flex-1 text-[#2d2d2c]"
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                <p className="text-lg leading-relaxed mb-6">
                  {feature.explanation}
                </p>
                <Link
                  href={feature.href}
                  className="inline-block text-white bg-[#a459ff] hover:bg-[#8c3cfb] transition px-6 py-3 rounded-full text-sm shadow-lg"
                >
                  开始体验 →
                </Link>
              </motion.div>

              {/* Clickable Card */}
              <motion.div
                className="flex-1 w-full group rounded-3xl overflow-hidden shadow-xl transform transition hover:scale-[1.03] cursor-pointer"
                whileHover={{ scale: 1.03 }}
              >
                <Link href={feature.href}>
                  <div className="relative w-full h-[300px] md:h-[400px]">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />
                    <div className="absolute bottom-6 left-6 text-white z-10">
                      <h3 className="text-2xl font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-sm mt-1">{feature.explanation}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
