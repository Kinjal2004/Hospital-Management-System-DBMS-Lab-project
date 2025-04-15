import React from 'react'
import ServicesCarousel from './assets/ServicesCarousel'

const Home = () => {
  return (
    <div>
      {/* Carousel */}
      <ServicesCarousel />

      {/* Hospital Description Section */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Welcome to Lifeline Multispeciality Hospital
          </h1>
          <p className="text-lg text-gray-600">
            At Lifeline, we combine cutting-edge medical technology with compassionate care to provide world-class healthcare services.
            Our team of highly skilled doctors, nurses, and support staff work round the clock to ensure your well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-secondary">24/7 Emergency Care</h2>
              <p>
                Our emergency department is equipped with advanced life-saving technology and expert physicians available round-the-clock.
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-secondary">Modern Infrastructure</h2>
              <p>
                State-of-the-art operation theatres, advanced diagnostic labs, and spacious patient rooms ensure the best experience.
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-secondary">Expert Specialists</h2>
              <p>
                Access top consultants in cardiology, neurology, pediatrics, orthopedics, and more — all under one roof.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
