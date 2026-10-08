import React from "react";
import { Link } from "react-router-dom";
import {
  FiBook, FiUsers, FiAward, FiClock, FiMapPin,
  FiArrowRight, FiMonitor, FiCalendar
} from "react-icons/fi";
import "./about.css";

const STATS = [
  { icon: <FiBook size={26} />,  number: "85,000+", label: "Print Volumes"    },
  { icon: <FiUsers size={26} />, number: "15,000+", label: "Active Users"     },
  { icon: <FiAward size={26} />, number: "50+",     label: "Academic Journals" },
  { icon: <FiClock size={26} />, number: "100+",    label: "Weekly Hours Open" },
];

const TIMELINE = [
  { year: "1965", event: "Foundation",           desc: "Established with a modest collection of 2,000 books to serve the newly founded institution." },
  { year: "1992", event: "Expansion",            desc: "Moved to a new location with expanded space to accommodate the growing student population."  },
  { year: "2010", event: "Digital Transformation", desc: "Implemented our first digital catalog and began offering e-resources to patrons."        },
  { year: "2022", event: "Modernization",        desc: "Comprehensive renovation with state-of-the-art study spaces and technology integration."    },
];

const FACILITIES = [
  { icon: <FiBook size={22} />,    img: "/assets/readingroom.webp",  name: "Main Reading Room",   desc: "Quiet study space with natural lighting and comfortable seating for 200 students." },
  { icon: <FiMonitor size={22} />, img: "/assets/computerlab.jpeg",  name: "Computer Lab",        desc: "40 workstations with academic software and high-speed internet access."            },
  { icon: <FiUsers size={22} />,   img: "/assets/groupstudyroom.jpeg",name: "Group Study Rooms",  desc: "12 bookable rooms equipped with whiteboards and presentation displays."            },
];

const AboutUs: React.FC = () => (
  <div className="lib-about">

    {/* Hero */}
    <section className="lib-about__hero">
      <div className="lib-about__hero-bg" aria-hidden="true" />
      <div className="lib-about__hero-overlay" aria-hidden="true" />
      <div className="lib-container lib-about__hero-content">
        <span className="lib-label lib-animate-fade-up">Our Story</span>
        <h1 className="lib-heading lib-about__hero-title lib-animate-fade-up lib-animate-delay-1">
          About Our <span className="lib-gradient-text">College Library</span>
        </h1>
        <p className="lib-subheading lib-animate-fade-up lib-animate-delay-2">
          Discover the heart of academic excellence — a space where curiosity meets knowledge.
        </p>
      </div>
      <div className="lib-about__hero-orb" aria-hidden="true" />
    </section>

    {/* Mission */}
    <section className="lib-section lib-about__mission">
      <div className="lib-container">
        <div className="lib-about__mission-grid">
          <div className="lib-about__mission-text">
            <span className="lib-label">Our Mission</span>
            <div className="lib-divider" />
            <h2 className="lib-heading" style={{ fontSize: "2rem" }}>
              Empowering learning through accessible resources
            </h2>
            <p className="lib-subheading" style={{ marginTop: "var(--space-4)" }}>
              The College Library is dedicated to supporting the academic and research needs of
              our students and faculty. We strive to provide equitable access to information,
              foster information literacy, and create an environment conducive to intellectual growth.
            </p>
            <p className="lib-subheading" style={{ marginTop: "var(--space-3)" }}>
              Our mission aligns with the college's commitment to academic excellence by providing
              comprehensive resources and services that enhance teaching, learning, and research.
            </p>
          </div>
          <div className="lib-about__mission-img-wrap">
            <img
              src="/assets/libraryinterior.jpg"
              alt="Library interior"
              className="lib-about__mission-img"
            />
            <div className="lib-about__mission-img-bg" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="lib-about__stats">
      <div className="lib-container">
        <div className="lib-section-header">
          <span className="lib-label">By The Numbers</span>
          <h2 className="lib-heading">Our Impact</h2>
        </div>
        <div className="lib-about__stats-grid">
          {STATS.map(({ icon, number, label }, i) => (
            <div key={i} className="lib-about__stat-card">
              <span className="lib-about__stat-icon">{icon}</span>
              <span className="lib-about__stat-number">{number}</span>
              <span className="lib-about__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="lib-section lib-about__timeline-section">
      <div className="lib-container">
        <div className="lib-section-header">
          <span className="lib-label">History</span>
          <h2 className="lib-heading">Our Journey</h2>
        </div>
        <div className="lib-about__timeline">
          {TIMELINE.map(({ year, event, desc }, i) => (
            <div key={i} className="lib-about__timeline-item">
              <div className="lib-about__timeline-year">
                <FiCalendar size={14} />
                {year}
              </div>
              <div className="lib-about__timeline-dot" />
              <div className="lib-about__timeline-card lib-card">
                <h3 className="lib-about__timeline-event">{event}</h3>
                <p className="lib-about__timeline-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Facilities */}
    <section className="lib-section lib-about__facilities">
      <div className="lib-container">
        <div className="lib-section-header">
          <span className="lib-label">Spaces</span>
          <h2 className="lib-heading">Our Facilities</h2>
          <p className="lib-subheading">Designed for focus, collaboration, and discovery</p>
        </div>
        <div className="lib-about__facilities-grid">
          {FACILITIES.map(({ icon, img, name, desc }, i) => (
            <div key={i} className="lib-about__facility-card lib-card">
              <div className="lib-about__facility-img-wrap">
                <img src={img} alt={name} className="lib-about__facility-img" />
                <div className="lib-about__facility-overlay" />
                <span className="lib-about__facility-icon">{icon}</span>
              </div>
              <div className="lib-about__facility-body">
                <h3 className="lib-about__facility-name">{name}</h3>
                <p className="lib-about__facility-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="lib-about__cta">
      <div className="lib-container">
        <div className="lib-about__cta-card">
          <div className="lib-about__cta-orb" aria-hidden="true" />
          <span className="lib-label">Ready to Explore?</span>
          <h2 className="lib-heading" style={{ marginTop: "var(--space-3)" }}>
            Experience our library today
          </h2>
          <p className="lib-subheading" style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-8)" }}>
            Visit us and discover all the resources, study spaces, and support we have to offer.
          </p>
          <div className="lib-about__cta-actions">
            <Link to="/contactus" className="lib-btn lib-btn-primary">
              <FiMapPin size={16} /> Get in Touch
            </Link>
            <Link to="/books" className="lib-btn lib-btn-outline">
              Browse Books <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default AboutUs;
