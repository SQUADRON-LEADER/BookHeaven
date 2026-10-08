import React from "react";
import { Link } from "react-router-dom";
import {
  FiBook, FiUsers, FiAward, FiClock, FiMapPin,
  FiArrowRight, FiMonitor, FiCalendar, FiShield, FiHeart
} from "react-icons/fi";
import "./about.css";

const STATS = [
  { icon: <FiBook size={28} />,    value: "50,000+", label: "Physical & Digital Books" },
  { icon: <FiUsers size={28} />,   value: "10,000+", label: "Active Student & Faculty Members" },
  { icon: <FiMonitor size={28} />, value: "50+",     label: "High-Speed Digital Terminals" },
  { icon: <FiAward size={28} />,   value: "25+",     label: "Years of Academic Excellence" },
];

const TIMELINE = [
  { year: "1999", title: "Foundation", desc: "Established with a modest collection of 2,000 reference books." },
  { year: "2010", title: "Digital Transformation", desc: "Automated cataloging system and digital subscriptions launched." },
  { year: "2018", title: "New Modern Wing", desc: "Expanded to 4 floors with dedicated research pods and quiet zones." },
  { year: "2024", title: "Cloud Portal", desc: "Integrated online issuing, real-time availability, and digital archives." },
];

const FACILITIES = [
  { icon: <FiBook size={22} />,     title: "Extensive Stacks",  desc: "Curated academic texts across Engineering, Sciences, Literature, and Arts." },
  { icon: <FiMonitor size={22} />,  title: "E-Resource Lab",    desc: "Access IEEE, Springer, JSTOR, and ScienceDirect journals on-campus." },
  { icon: <FiShield size={22} />,   title: "Study Pods",        desc: "Quiet individual and group collaboration pods with power outlets." },
  { icon: <FiCalendar size={22} />, title: "Workshops & Events",desc: "Regular author talks, research methodology seminars, and book clubs." },
];

export default function AboutUs() {
  return (
    <div className="lib-about">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="lib-about__hero">
        <div className="lib-about__hero-glow" />
        <div className="lib-container lib-about__hero-content">
          <span className="lib-section__eyebrow">Discover AGC Library</span>
          <h1 className="lib-about__hero-title">
            Inspiring curiosity, preserving knowledge, empowering minds.
          </h1>
          <p className="lib-about__hero-sub">
            The Central Library at AGC is the intellectual heart of the campus &mdash; dedicated to
            providing comprehensive learning resources for students, researchers, and faculty.
          </p>
          <div className="lib-about__hero-actions">
            <Link to="/books" className="lib-btn lib-btn-primary lib-btn--lg">
              Browse Collection <FiArrowRight size={16} />
            </Link>
            <Link to="/contactus" className="lib-btn lib-btn-ghost lib-btn--lg">
              Contact Staff
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="lib-about__stats-sec">
        <div className="lib-container">
          <div className="lib-about__stats-grid">
            {STATS.map(({ icon, value, label }, i) => (
              <div key={i} className="lib-about__stat-card">
                <div className="lib-about__stat-icon">{icon}</div>
                <div className="lib-about__stat-val">{value}</div>
                <div className="lib-about__stat-lbl">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────────────── */}
      <section className="lib-section">
        <div className="lib-container">
          <div className="lib-about__dual-grid">
            <div className="lib-about__card-accent">
              <span className="lib-section__eyebrow">Our Mission</span>
              <h2>Nurturing Lifelong Learners</h2>
              <p>
                To support the teaching, research, and learning mission of the college by providing
                equitable access to high-quality academic information resources, modern study spaces,
                and innovative information services.
              </p>
              <ul className="lib-about__list">
                <li>Provide easy access to diverse academic collections</li>
                <li>Support faculty research and student scholarship</li>
                <li>Foster an environment of inquiry and academic integrity</li>
              </ul>
            </div>

            <div className="lib-about__card-accent">
              <span className="lib-section__eyebrow">Our Vision</span>
              <h2>A World-Class Knowledge Hub</h2>
              <p>
                To be recognized as a premier 21st-century academic library that seamlessly integrates
                physical and digital environments to accelerate discovery and scholarship.
              </p>
              <ul className="lib-about__list">
                <li>Champion open-access and digitized academic content</li>
                <li>Continuous upgrading of study facilities &amp; tech</li>
                <li>Deliver personalized research support to every scholar</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FACILITIES ───────────────────────────────────────────── */}
      <section className="lib-section lib-about__facilities-sec">
        <div className="lib-container">
          <div className="lib-section__header">
            <div>
              <span className="lib-section__eyebrow">What We Offer</span>
              <h2 className="lib-section__title">World-Class Facilities</h2>
            </div>
          </div>

          <div className="lib-about__fac-grid">
            {FACILITIES.map(({ icon, title, desc }, i) => (
              <div key={i} className="lib-about__fac-card">
                <div className="lib-about__fac-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────── */}
      <section className="lib-section">
        <div className="lib-container">
          <div className="lib-section__header">
            <div>
              <span className="lib-section__eyebrow">Our Journey</span>
              <h2 className="lib-section__title">Milestones in Growth</h2>
            </div>
          </div>

          <div className="lib-about__timeline">
            {TIMELINE.map(({ year, title, desc }, i) => (
              <div key={i} className="lib-about__tl-item">
                <div className="lib-about__tl-year">{year}</div>
                <div className="lib-about__tl-content">
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="lib-section">
        <div className="lib-container">
          <div className="lib-about__cta-card">
            <div className="lib-about__cta-text">
              <h2>Ready to start exploring?</h2>
              <p>Discover our vast collection or sign in to reserve books online in seconds.</p>
            </div>
            <div className="lib-about__cta-btns">
              <Link to="/books" className="lib-btn lib-btn-primary lib-btn--lg">
                Explore Books <FiArrowRight size={16} />
              </Link>
              <Link to="/register" className="lib-btn lib-btn-ghost lib-btn--lg">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}