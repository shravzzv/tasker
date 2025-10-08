import Image from 'next/image'
import Link from 'next/link'

const testimonials = [
  {
    name: 'Jane Doe',
    role: 'Product Manager',
    quote:
      "Tasker has completely transformed the way I organize my work. It's intuitive and powerful!",
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'John Smith',
    role: 'Freelancer',
    quote:
      'I love how easy it is to keep track of my projects. The reminders are a lifesaver!',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Emily Chen',
    role: 'Developer',
    quote:
      "The best productivity app I've used. The UI is beautiful and everything just works.",
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
]

const pricing = [
  {
    title: 'Free',
    price: '$0',
    features: [
      'Unlimited tasks',
      'Basic reminders',
      '1 project',
      'Community support',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    title: 'Pro',
    price: '$20/mo',
    features: [
      'Unlimited projects',
      'Advanced reminders',
      'Collaboration tools',
      'Priority support',
    ],
    cta: 'Upgrade Now',
    highlight: true,
  },
  {
    title: 'Team',
    price: '$50/mo',
    features: [
      'Team workspaces',
      'Admin controls',
      'Integrations',
      'Dedicated support',
    ],
    cta: 'Start Team Trial',
    highlight: false,
  },
]

export default function Page() {
  return (
    <main className='bg-gradient-to-b from-white to-slate-100 min-h-screen font-sans'>
      {/* Sticky Navbar */}
      <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Image
              src='/icon.svg'
              alt='Tasker Logo'
              width={32}
              height={32}
              className='h-8 w-8'
            />
            <span className='text-xl font-bold text-slate-800 tracking-tight'>
              Tasker
            </span>
          </div>
          <div className='hidden md:flex gap-8 text-slate-700 font-medium'>
            <a href='#features' className='hover:text-blue-600 transition'>
              Features
            </a>
            <a href='#testimonials' className='hover:text-blue-600 transition'>
              Testimonials
            </a>
            <a href='#pricing' className='hover:text-blue-600 transition'>
              Pricing
            </a>
            <a href='#footer' className='hover:text-blue-600 transition'>
              Contact
            </a>
          </div>
          <div>
            <Link href='/signin'>Signin</Link>
            <Link
              href='/signup'
              className='ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition'
            >
              Signup
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className='max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12'
        id='hero'
      >
        <div className='flex-1'>
          <h1 className='text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight'>
            Organize your life with{' '}
            <span className='text-blue-600'>Tasker</span>
          </h1>
          <p className='text-lg md:text-2xl text-slate-700 mb-8'>
            The ultimate productivity app to manage your tasks, projects, and
            goals—all in one place.
          </p>
          <Link
            href='/signup'
            className='inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition'
          >
            Try Tasker Free
          </Link>
        </div>
        <div className='flex-1 flex justify-center'>
          <Image
            src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80'
            alt='Tasker App Preview'
            width={400}
            height={500}
            className='rounded-2xl shadow-2xl w-full max-w-md border border-slate-200'
            unoptimized
          />
        </div>
      </section>

      {/* Features Section */}
      <section className='max-w-7xl mx-auto px-4 py-16' id='features'>
        <h2 className='text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12'>
          Features
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white rounded-xl shadow p-6 flex flex-col items-center text-center'>
            <span className='text-blue-600 text-4xl mb-4'>📝</span>
            <h3 className='font-semibold text-xl mb-2'>
              Smart Task Management
            </h3>
            <p className='text-slate-600'>
              Create, organize, and prioritize tasks with ease. Stay on top of
              your to-dos effortlessly.
            </p>
          </div>
          <div className='bg-white rounded-xl shadow p-6 flex flex-col items-center text-center'>
            <span className='text-blue-600 text-4xl mb-4'>⏰</span>
            <h3 className='font-semibold text-xl mb-2'>
              Reminders & Deadlines
            </h3>
            <p className='text-slate-600'>
              Never miss a deadline with customizable reminders and recurring
              tasks.
            </p>
          </div>
          <div className='bg-white rounded-xl shadow p-6 flex flex-col items-center text-center'>
            <span className='text-blue-600 text-4xl mb-4'>🤝</span>
            <h3 className='font-semibold text-xl mb-2'>Collaboration</h3>
            <p className='text-slate-600'>
              Work with your team, assign tasks, and track progress together in
              real time.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className='max-w-7xl mx-auto px-4 py-16 bg-blue-50 rounded-2xl my-12'
        id='testimonials'
      >
        <h2 className='text-3xl md:text-4xl font-bold text-center text-blue-700 mb-12'>
          What our users say
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((t: (typeof testimonials)[number], i: number) => (
            <div
              key={i}
              className='bg-white rounded-xl shadow p-6 flex flex-col items-center text-center'
            >
              <Image
                src={t.avatar}
                alt={t.name}
                width={64}
                height={64}
                className='w-16 h-16 rounded-full mb-4 border-2 border-blue-200'
                unoptimized
              />
              <p className='text-slate-700 italic mb-4'>“{t.quote}”</p>
              <span className='font-semibold text-slate-900'>{t.name}</span>
              <span className='text-slate-500 text-sm'>{t.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className='max-w-7xl mx-auto px-4 py-16' id='pricing'>
        <h2 className='text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12'>
          Pricing
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {pricing.map((plan: (typeof pricing)[number], i: number) => (
            <div
              key={i}
              className={`rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-2 transition-all ${
                plan.highlight
                  ? 'border-blue-600 bg-blue-50 scale-105 z-10'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <h3 className='font-bold text-2xl mb-2'>{plan.title}</h3>
              <div className='text-3xl font-extrabold text-blue-600 mb-4'>
                {plan.price}
              </div>
              <ul className='mb-6 space-y-2'>
                {plan.features.map((f: string, j: number) => (
                  <li
                    key={j}
                    className='text-slate-700 flex items-center gap-2 justify-center'
                  >
                    <span className='text-blue-500'>✔</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href='#'
                className={`px-6 py-2 rounded-lg font-semibold shadow transition-all ${
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className='max-w-7xl mx-auto px-4 py-16 text-center'>
        <h2 className='text-3xl md:text-4xl font-bold text-slate-900 mb-6'>
          Ready to boost your productivity?
        </h2>
        <p className='text-lg text-slate-700 mb-8'>
          Sign up now and start organizing your life with Tasker.
        </p>
        <a
          href='#pricing'
          className='inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition'
        >
          Get Started Free
        </a>
      </section>

      {/* Footer */}
      <footer className='bg-slate-900 text-slate-200 py-16 mt-12' id='footer'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-start items-center justify-between gap-10'>
          {/* Logo and Brand */}
          <div className='flex flex-col items-center md:items-start gap-3 mb-8 md:mb-0'>
            <div className='flex items-center gap-2'>
              <Image
                src='/icon.svg'
                alt='Tasker Logo'
                width={32}
                height={32}
                className='h-8 w-8'
              />
              <span className='text-2xl font-bold tracking-tight'>Tasker</span>
            </div>
            <span className='text-slate-400 text-sm'>
              The ultimate productivity app
            </span>
          </div>

          {/* Links */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-slate-400 mb-8 md:mb-0'>
            <div className='flex flex-col gap-2'>
              <span className='font-semibold text-slate-300 mb-1'>Product</span>
              <a href='#features' className='hover:text-white transition'>
                Features
              </a>
              <a href='#pricing' className='hover:text-white transition'>
                Pricing
              </a>
              <a href='#testimonials' className='hover:text-white transition'>
                Testimonials
              </a>
              <a href='#' className='hover:text-white transition'>
                Blog
              </a>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='font-semibold text-slate-300 mb-1'>Company</span>
              <a href='#' className='hover:text-white transition'>
                About
              </a>
              <a href='#' className='hover:text-white transition'>
                Careers
              </a>
              <a
                href='mailto:hello@tasker.app'
                className='hover:text-white transition'
              >
                Contact
              </a>
              <a href='#' className='hover:text-white transition'>
                Press
              </a>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='font-semibold text-slate-300 mb-1'>
                Community
              </span>
              <a
                href='https://discord.gg/mp8VHd5fyh'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-white transition'
              >
                Discord
              </a>
              <a
                href='https://github.com/shravzzv/tasker'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-white transition'
              >
                GitHub Repo
              </a>
              <a
                href='https://github.com/shravzzv/tasker/issues'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-white transition'
              >
                Submit Issues
              </a>
              <a href='#' className='hover:text-white transition'>
                Changelog
              </a>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='font-semibold text-slate-300 mb-1'>Legal</span>
              <a href='#' className='hover:text-white transition'>
                Terms
              </a>
              <a href='#' className='hover:text-white transition'>
                Privacy
              </a>
              <a href='#' className='hover:text-white transition'>
                Security
              </a>
              <a href='#' className='hover:text-white transition'>
                Cookies
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className='flex flex-col items-center md:items-end gap-2'>
            <div className='text-slate-400 text-xs'>
              © {new Date().getFullYear()} Tasker. All rights reserved.
            </div>
            <div className='flex gap-4 mt-2'>
              <a
                href='https://discord.gg/mp8VHd5fyh'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-blue-400 transition'
              >
                Discord
              </a>
              <a
                href='https://github.com/shravzzv/tasker'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-white transition'
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
