import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Play, ChevronDown } from 'lucide-react';
import './Landing.css';

const translations = {
  en: {
    govt: "தமிழ்நாடு அரசு | Government of Tamil Nadu",
    title: "Tamil Nadu Disaster Management Authority",
    subtitle: "ALERTGOV AI - Officer Login",
    navHome: "Home",
    navMoves: "How a Report Moves",
    navFeatures: "What Runs On It",
    navAlerts: "Alerts Hub",
    navLogin: "Officer Login",
    hero1: "ONE REPORT.",
    hero2: "FIVE TIERS.",
    hero3: "ZERO DELAY.",
    heroDesc: "AlertGov AI carries an incident from the first village report to state-level command through a single, auditable escalation chain — so the decision gets made before the disaster gets worse.",
    btnAccess: "Access Command Terminal",
    btnChain: "See the escalation chain",
    heroRight1: "EMERGENCY",
    heroRight2: "ALERT &",
    heroRight3: "DISASTER",
    heroRight4: "MANAGEMENT",
    heroRight5: "NETWORK",
    liveAlerts: "Live Alerts",
    viewAll: "View All",
    sloganTitle: "Disaster Awareness",
    movesTitle: "HOW A REPORT MOVES",
    movesSub1: "Five real tiers. No shortcuts, no dead ends.",
    movesSub2: "Every officer ID on the login screen carries one of these prefixes. The prefix is not decoration — it is the exact tier that ID can act at.",
    tier1Title: "Village — First Responder",
    tier1Desc: "Raises the first incident report from the ground — photos, location, and severity, logged the moment something happens.",
    tier2Title: "Taluk — Verification",
    tier2Desc: "Confirms the report, rules out duplicates, and clears it for district attention within minutes, not meetings.",
    tier3Title: "District EOC — Resource Command",
    tier3Desc: "Allocates resources, opens the GIS situation map, and broadcasts the first public alert if warranted.",
    tier4Title: "Collector — Executive Approval",
    tier4Desc: "Signs off on evacuation orders and official directives once an incident crosses critical thresholds.",
    tier5Title: "State — Oversight & Prediction",
    tier5Desc: "Watches every district at once and runs AI-assisted prediction so the next report arrives before the disaster does.",
    featTitle: "WHAT RUNS ON IT",
    featSub: "Built for the decision, not the dashboard.",
    feat1Title: "Incident Reporting",
    feat1Desc: "Any village officer can file a geotagged incident in under a minute, from a phone that already has one bar of signal.",
    feat2Title: "GIS Situation Mapping",
    feat2Desc: "Live district and state maps plot every active incident, resource, and evacuation zone on one shared layer.",
    feat3Title: "AI-Assisted Analytics",
    feat3Desc: "Severity triage and disaster prediction models surface what needs a human decision first.",
    feat4Title: "Alert & Broadcast",
    feat4Desc: "District and Collector-level officers push verified alerts and evacuation orders straight to the field.",
    cta: "If you hold an Officer ID, the system is already waiting on you.",
    importantLinks: "Important Links",
    helplineTitle: "HELPLINE NUMBERS",
    link1: "Government of Tamil Nadu",
    link2: "Public Distribution System (PDS)",
    link3: "Tamil Nadu Tourism",
    link4: "Tamil Nadu Agricutural University",
    link5: "Election Commission of India",
    link6: "State Election Commission",
    help1: "State Control Room :",
    help2: "Collectorate Control Room :",
    help3: "Police Control Room :",
    help4: "Fire Service :",
    help5: "Ambulance :",
    help6: "Child Helpline :",
    footWeb: "Website Policies",
    footHelp: "Help",
    footContact: "Contact Us",
    footFeedback: "Feedback",
    footOwned: "Content Owned by State Administration",
    footCopy: "© Content owned and maintained by Tamil Nadu State Administration , Developed and hosted by National Informatics Centre, \nMinistry of Electronics & Information Technology, Government of India",
    footUpdate: "Last Updated: Jun 29, 2026",
    footLogo1: "Secure, Scalable and Sugamya Website as a Service",
    footLogo2: "National Informatics Center",
    footLogo3: "Digital India Power To Empower",
    cmTitle: "Honorable Chief Minister",
    cmName: "Thiru C. Joseph Vijay",
    minTitle: "Minister for Revenue & Disaster Management",
    minName: "Thiru K.A. Sengottaiyan",
  },
  ta: {
    govt: "தமிழ்நாடு அரசு | Government of Tamil Nadu",
    title: "தமிழ்நாடு பேரிடர் மேலாண்மை ஆணையம்",
    subtitle: "ALERTGOV AI - அதிகாரி உள்நுழைவு",
    navHome: "முகப்பு",
    navMoves: "ஒரு அறிக்கை எவ்வாறு நகர்கிறது",
    navFeatures: "இதில் என்ன இயங்குகிறது",
    navAlerts: "எச்சரிக்கைகள் மையம்",
    navLogin: "அதிகாரி உள்நுழைவு",
    hero1: "ஒரு அறிக்கை.",
    hero2: "ஐந்து அடுக்குகள்.",
    hero3: "தாமதம் இல்லை.",
    heroDesc: "AlertGov AI ஆனது முதல் கிராம அளவிலான அறிக்கையிலிருந்து மாநில அளவிலான கட்டளைக்கு ஒற்றை, தணிக்கை செய்யக்கூடிய விரிவாக்க சங்கிலி மூலம் ஒரு சம்பவத்தைக் கொண்டு செல்கிறது — இதனால் பேரிடர் மோசமடைவதற்கு முன்பே முடிவு எடுக்கப்படும்.",
    btnAccess: "கட்டளை முனையத்தை அணுகவும்",
    btnChain: "விரிவாக்க சங்கிலியைப் பார்க்கவும்",
    heroRight1: "அவசரக்கால",
    heroRight2: "எச்சரிக்கை &",
    heroRight3: "பேரிடர்",
    heroRight4: "மேலாண்மை",
    heroRight5: "நெட்வொர்க்",
    liveAlerts: "நேரடி எச்சரிக்கைகள்",
    viewAll: "அனைத்தையும் காண்க",
    sloganTitle: "பேரிடர் விழிப்புணர்வு",
    movesTitle: "ஒரு அறிக்கை எவ்வாறு நகர்கிறது",
    movesSub1: "ஐந்து உண்மையான அடுக்குகள். குறுக்குவழிகள் இல்லை, முட்டுக்கட்டைகள் இல்லை.",
    movesSub2: "உள்நுழைவுத் திரையில் உள்ள ஒவ்வொரு அதிகாரி அடையாளமும் இந்த முன்னொட்டுகளில் ஒன்றைக் கொண்டுள்ளது. முன்னொட்டு அலங்காரமல்ல — அந்த ஐடி செயல்படக்கூடிய சரியான அடுக்கு இதுவாகும்.",
    tier1Title: "கிராமம் — முதல் பதிலளிப்பவர்",
    tier1Desc: "களத்திலிருந்து முதல் சம்பவ அறிக்கையை எழுப்புகிறது — புகைப்படங்கள், இருப்பிடம் மற்றும் தீவிரம், ஏதேனும் நடந்த தருணத்தில் பதிவு செய்யப்படும்.",
    tier2Title: "தாலுகா — சரிபார்த்தல்",
    tier2Desc: "அறிக்கையை உறுதிப்படுத்துகிறது, நகல்களை நிராகரிக்கிறது மற்றும் கூட்டங்கள் அல்ல, நிமிடங்களுக்குள் மாவட்ட கவனத்திற்காக அதை அழிக்கிறது.",
    tier3Title: "மாவட்ட EOC — வள கட்டளை",
    tier3Desc: "வளங்களை ஒதுக்குகிறது, GIS நிலைமை வரைபடத்தைத் திறக்கிறது மற்றும் தேவைப்பட்டால் முதல் பொது எச்சரிக்கையை ஒளிபரப்புகிறது.",
    tier4Title: "ஆட்சியர் — நிர்வாக ஒப்புதல்",
    tier4Desc: "ஒரு சம்பவம் அபாயகரமான நிலையைத் தாண்டியதும், வெளியேற்ற உத்தரவுகள் மற்றும் அதிகாரப்பூர்வ உத்தரவுகளில் கையொப்பமிடுகிறார்.",
    tier5Title: "மாநிலம் — மேற்பார்வை மற்றும் கணிப்பு",
    tier5Desc: "ஒரே நேரத்தில் ஒவ்வொரு மாவட்டத்தையும் கண்காணித்து, பேரிடர் வருவதற்கு முன்பே அடுத்த அறிக்கை வருவதற்காக AI-உதவி கணிப்பை இயக்குகிறது.",
    featTitle: "இதில் என்ன இயங்குகிறது",
    featSub: "டாஷ்போர்டிற்காக அல்ல, முடிவுக்காக வடிவமைக்கப்பட்டுள்ளது.",
    feat1Title: "சம்பவ அறிக்கை",
    feat1Desc: "எந்த கிராம அதிகாரியும், சிக்னல் உள்ள ஃபோனில் இருந்து ஒரு நிமிடத்திற்குள் ஜியோடேக் செய்யப்பட்ட சம்பவத்தை தாக்கல் செய்யலாம்.",
    feat2Title: "GIS நிலைமை வரைபடம்",
    feat2Desc: "நேரடி மாவட்ட மற்றும் மாநில வரைபடங்கள் ஒவ்வொரு செயலில் உள்ள சம்பவம், வளம் மற்றும் வெளியேற்ற மண்டலத்தை ஒரு பகிரப்பட்ட அடுக்கில் திட்டமிடுகின்றன.",
    feat3Title: "AI-உதவி பகுப்பாய்வு",
    feat3Desc: "தீவிரத்தன்மை மற்றும் பேரிடர் கணிப்பு மாதிரிகள் மனித முடிவு முதலில் என்ன தேவை என்பதை வெளிப்படுத்துகின்றன.",
    feat4Title: "எச்சரிக்கை & ஒளிபரப்பு",
    feat4Desc: "மாவட்ட மற்றும் ஆட்சியர் நிலை அதிகாரிகள் சரிபார்க்கப்பட்ட எச்சரிக்கைகள் மற்றும் வெளியேற்ற உத்தரவுகளை நேரடியாக களத்திற்கு அனுப்புகிறார்கள்.",
    cta: "உங்களிடம் அதிகாரி ஐடி இருந்தால், சிஸ்டம் ஏற்கனவே உங்களுக்காகக் காத்திருக்கிறது.",
    importantLinks: "முக்கிய இணைப்புகள்",
    helplineTitle: "உதவி எண்கள்",
    link1: "தமிழ்நாடு அரசு",
    link2: "பொது விநியோக திட்டம் (PDS)",
    link3: "தமிழ்நாடு சுற்றுலா",
    link4: "தமிழ்நாடு வேளாண் பல்கலைக்கழகம்",
    link5: "இந்திய தேர்தல் ஆணையம்",
    link6: "மாநில தேர்தல் ஆணையம்",
    help1: "மாநில கட்டுப்பாட்டு அறை :",
    help2: "மாவட்ட ஆட்சியர் அலுவலக கட்டுப்பாட்டு அறை :",
    help3: "காவல்துறை கட்டுப்பாட்டு அறை :",
    help4: "தீயணைப்பு துறை :",
    help5: "ஆம்புலன்ஸ் :",
    help6: "குழந்தைகள் உதவி எண் :",
    footWeb: "இணையதள கொள்கைகள்",
    footHelp: "உதவி",
    footContact: "தொடர்பு கொள்ள",
    footFeedback: "பின்னூட்டம்",
    footOwned: "உள்ளடக்கம் மாநில நிர்வாகத்திற்கு சொந்தமானது",
    footCopy: "© உள்ளடக்கம் தமிழ்நாடு மாநில நிர்வாகத்திற்கு சொந்தமானது மற்றும் பராமரிக்கப்படுகிறது, தேசிய தகவல் மையம், \nமின்னணு மற்றும் தகவல் தொழில்நுட்ப அமைச்சகம், இந்திய அரசு மூலம் உருவாக்கப்பட்டு தொகுக்கப்பட்டுள்ளது",
    footUpdate: "கடைசியாக புதுப்பிக்கப்பட்டது: ஜூன் 29, 2026",
    footLogo1: "பாதுகாப்பான, அளவிடக்கூடிய மற்றும் சுகம்யா வலைத்தளம்",
    footLogo2: "தேசிய தகவல் மையம்",
    footLogo3: "டிஜிட்டல் இந்தியா அதிகாரமளிக்க",
    cmTitle: "மாண்புமிகு முதலமைச்சர்",
    cmName: "திரு. சி. ஜோசப் விஜய்",
    minTitle: "மாண்புமிகு அமைச்சர் (வருவாய் மற்றும் பேரிடர் மேலாண்மை)",
    minName: "திரு. கே.ஏ. செங்கோட்டையன்",
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const handleFontSize = (action) => {
    const html = document.documentElement;
    let currentSize = parseInt(html.style.fontSize) || 100;
    
    if (action === 'decrease' && currentSize > 80) {
      html.style.fontSize = `${currentSize - 10}%`;
    } else if (action === 'increase' && currentSize < 120) {
      html.style.fontSize = `${currentSize + 10}%`;
    } else if (action === 'reset') {
      html.style.fontSize = '100%';
    }
  };

  return (
    <div className="landing-page">
      
      {/* 1. Top Bar */}
      <div className="ndma-top-bar">
        <div className="top-bar-left">
          <span>{t.govt}</span>
        </div>
        <div className="top-bar-right">
          <div className="font-sizers">
            <span onClick={() => handleFontSize('decrease')} style={{cursor: 'pointer'}} title="Decrease Font Size">A-</span>
            <span onClick={() => handleFontSize('reset')} style={{cursor: 'pointer'}} title="Normal Font Size">A</span>
            <span onClick={() => handleFontSize('increase')} style={{cursor: 'pointer'}} title="Increase Font Size">A+</span>
          </div>
          <div className="language-selector" style={{ borderRight: 'none' }}>
            <span 
              className={lang === 'en' ? "active" : ""} 
              onClick={() => setLang('en')}
              style={{cursor: 'pointer'}}
            >English</span> | 
            <span 
              className={lang === 'ta' ? "active" : ""} 
              onClick={() => setLang('ta')}
              style={{cursor: 'pointer'}}
            >தமிழ்</span>
          </div>
        </div>
      </div>

      {/* 2. Logo Bar (Logos, Title) */}
      <div className="ndma-logo-bar">
        <div className="logo-left">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYrCtU8k-Z8dC8m0yFrXAll8qUAYJeg6ypB-MGZ2-keA&s=10" 
            alt="Tamil Nadu Emblem" 
            style={{ height: '70px', width: 'auto', marginRight: '10px' }} 
          />
          <div className="logo-text">
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>
        <div className="logo-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '25px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgT0vDPyimsdLQojC9kFqAS-FsmIUUZQS-6zHfAX6FegNwFh1JWhqjU6Q&s=10" 
                  alt={t.cmName} 
                  style={{ height: '65px', width: '60px', borderRadius: '4px', objectFit: 'cover', border: '2px solid #1C4E80', marginBottom: '4px' }} 
                />
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#1C4E80', lineHeight: '1.2' }}>
                  {t.cmTitle}<br/>{t.cmName}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/4/4f/K.A._Sengottaiyan.jpg" 
                  alt={t.minName} 
                  style={{ height: '65px', width: '60px', borderRadius: '4px', objectFit: 'cover', border: '2px solid #1C4E80', marginBottom: '4px' }} 
                />
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#1C4E80', lineHeight: '1.2', maxWidth: '140px' }}>
                  {t.minTitle}<br/>{t.minName}
                </div>
              </div>
            </div>

            <img src="https://www.uxdt.nic.in/wp-content/uploads/2024/02/ndap-01-01.jpg?x29347" alt="Satyameva Jayate" style={{ height: '100px', width: 'auto' }} />
          </div>
        </div>
      </div>

      {/* 3. Main Navigation */}
      <div className="ndma-nav-container">
        <nav className="ndma-nav">
          <a href="#home">{t.navHome}</a>
          <a href="#hierarchy">{t.navMoves}</a>
          <a href="#features">{t.navFeatures}</a>
          
          <button className="login-btn-nav" onClick={() => navigate('/login')}>
            {t.navLogin}
          </button>
        </nav>
      </div>

      {/* 4. Hero Banner */}
      <section className="ndma-hero" id="home">
        
        {/* Left Floating Box */}
        <div className="hero-left-box">
          <h2 className="hero-title">{t.hero1}<br/>{t.hero2}<br/>{t.hero3}</h2>
          <div className="hero-left-text">
            <p>{t.heroDesc}</p>
            <div className="hero-buttons">
              <button onClick={() => navigate('/login')}>{t.btnAccess}</button>
              <button onClick={() => window.location.href='#hierarchy'}>{t.btnChain}</button>
            </div>
          </div>
        </div>

        {/* Right Angled Blue Shape */}
        <div className="hero-right-angled">
          <div className="hero-right-content">
            <h2 style={{fontSize: '2.2rem'}}>{t.heroRight1}<br />{t.heroRight2}<br />{t.heroRight3}<br />{t.heroRight4}<br />{t.heroRight5}</h2>
          </div>
        </div>
      </section>

      {/* 5. Alerts Ticker */}
      <div className="ndma-alerts-bar" id="alerts">
        <div className="alerts-label">
          <Play size={18} fill="white" />
          {t.sloganTitle}
        </div>
        <div className="alerts-marquee">
          <marquee scrollamount="5">
            <span className="alert-item alert-yellow">முன்னெச்சரிக்கையே முதல் பாதுகாப்பு!</span>
            <span className="alert-item alert-black">தயாராக இருப்போம், ஆபத்தை தவிர்ப்போம்!</span>
            <span className="alert-item alert-yellow">ஒன்றாக இணைவோம், பேரிடரை வெல்வோம்!</span>
            <span className="alert-item alert-black">விபத்தில்லா தமிழகம், நமது இலக்கு!</span>
            <span className="alert-item alert-yellow">அச்சம் தவிர், அவசரத்திற்கு தயார் செய்!</span>
          </marquee>
        </div>
      </div>

      {/* 6. HOW A REPORT MOVES (Hierarchy) */}
      <section className="ndma-section grey-bg" id="hierarchy">
        <div className="section-header">
          <h2 className="ndma-section-title">{t.movesTitle}</h2>
          <p className="section-subtitle">
            {t.movesSub1}<br/>
            {t.movesSub2}
          </p>
        </div>

        <div className="tiers-container">
          
          <div className="tier-card">
            <div className="tier-prefix">
              <span className="num">01</span>
              <h3>VEO</h3>
            </div>
            <div className="tier-content">
              <h4>{t.tier1Title}</h4>
              <p>{t.tier1Desc}</p>
            </div>
          </div>

          <div className="tier-card">
            <div className="tier-prefix">
              <span className="num">02</span>
              <h3>TAL</h3>
            </div>
            <div className="tier-content">
              <h4>{t.tier2Title}</h4>
              <p>{t.tier2Desc}</p>
            </div>
          </div>

          <div className="tier-card">
            <div className="tier-prefix">
              <span className="num">03</span>
              <h3>DEC</h3>
            </div>
            <div className="tier-content">
              <h4>{t.tier3Title}</h4>
              <p>{t.tier3Desc}</p>
            </div>
          </div>

          <div className="tier-card">
            <div className="tier-prefix">
              <span className="num">04</span>
              <h3>COL</h3>
            </div>
            <div className="tier-content">
              <h4>{t.tier4Title}</h4>
              <p>{t.tier4Desc}</p>
            </div>
          </div>

          <div className="tier-card">
            <div className="tier-prefix">
              <span className="num">05</span>
              <h3>STA</h3>
            </div>
            <div className="tier-content">
              <h4>{t.tier5Title}</h4>
              <p>{t.tier5Desc}</p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. WHAT RUNS ON IT (Features) */}
      <section className="ndma-section" id="features">
        <div className="section-header">
          <h2 className="ndma-section-title">{t.featTitle}</h2>
          <p className="section-subtitle">{t.featSub}</p>
        </div>

        <div className="features-grid">
          
          <div className="feature-box">
            <h3>{t.feat1Title}</h3>
            <p>{t.feat1Desc}</p>
          </div>

          <div className="feature-box">
            <h3>{t.feat2Title}</h3>
            <p>{t.feat2Desc}</p>
          </div>

          <div className="feature-box">
            <h3>{t.feat3Title}</h3>
            <p>{t.feat3Desc}</p>
          </div>

          <div className="feature-box">
            <h3>{t.feat4Title}</h3>
            <p>{t.feat4Desc}</p>
          </div>

        </div>
      </section>

      {/* 8. Bottom CTA */}
      <section className="cta-section">
        <h2>{t.cta}</h2>
        <button className="cta-button" onClick={() => navigate('/login')}>{t.btnAccess}</button>
      </section>

      {/* 9. Footer (NIC Style) */}
      <footer className="nic-footer">
        <div className="footer-top">
          <div className="footer-col">
            <h3>{t.importantLinks}</h3>
            <div className="links-grid">
              <ul>
                <li><a href="https://www.tn.gov.in/" target="_blank" rel="noopener noreferrer">{t.link1}</a></li>
                <li><a href="https://www.tnpds.gov.in/pages/home" target="_blank" rel="noopener noreferrer">{t.link2}</a></li>
                <li><a href="https://www.tamilnadutourism.tn.gov.in/" target="_blank" rel="noopener noreferrer">{t.link3}</a></li>
              </ul>
              <ul>
                <li><a href="https://tnau.ac.in/" target="_blank" rel="noopener noreferrer">{t.link4}</a></li>
                <li><a href="https://www.eci.gov.in/" target="_blank" rel="noopener noreferrer">{t.link5}</a></li>
                <li><a href="http://www.tnsec.tn.nic.in/" target="_blank" rel="noopener noreferrer">{t.link6}</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-col">
            <h3>{t.helplineTitle}</h3>
            <ul className="helpline-list">
              <li><span>{t.help1}</span> 1070</li>
              <li><span>{t.help2}</span> 1077</li>
              <li><span>{t.help3}</span> 100</li>
              <li><span>{t.help4}</span> 101</li>
              <li><span>{t.help5}</span> 108</li>
              <li><span>{t.help6}</span> 1098</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-inline-links">
            <Link to="/policies">{t.footWeb}</Link>
            <Link to="/help">{t.footHelp}</Link>
            <Link to="/contact">{t.footContact}</Link>
            <Link to="/feedback">{t.footFeedback}</Link>
          </div>
          <p className="footer-owned">{t.footOwned}</p>
          <p style={{whiteSpace: 'pre-line'}}>{t.footCopy}</p>
          <p className="last-updated">{t.footUpdate}</p>
          <div className="footer-logos-text">
            <span>{t.footLogo1}</span> | 
            <span>{t.footLogo2}</span> | 
            <span>{t.footLogo3}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
