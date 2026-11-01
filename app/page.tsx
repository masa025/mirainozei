'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import IntroScreen from '../components/IntroScreen';
import DebtClock from '../components/DebtClock';
import PopulationTicker from '../components/PopulationTicker';
import DisappearingCitiesWidget from '../components/DisappearingCitiesWidget';
import DemographicChart from '../components/DemographicChart';
import SilverDemocracyWidget from '../components/SilverDemocracyWidget';
import SupportRatioWidget from '../components/SupportRatioWidget';
import InfrastructureStatusWidget from '../components/InfrastructureStatusWidget';
import WeatherWidget from '../components/WeatherWidget';
import NewsWidget from '../components/NewsWidget';
import PersonalDebtCounter from '../components/PersonalDebtCounter';
import TaxBalanceTicker from '../components/TaxBalanceTicker';
import OpportunityCostWidget from '../components/OpportunityCostWidget';
import EarthquakeMonitor from '../components/EarthquakeMonitor';
import ExchangeRateWidget from '../components/ExchangeRateWidget';
import RealWageWidget from '../components/RealWageWidget';
import CorporateMetabolismWidget from '../components/CorporateMetabolismWidget';
import DecisionMakerAgeWidget from '../components/DecisionMakerAgeWidget';
import AgeIncomeComparisonWidget from '../components/AgeIncomeComparisonWidget';
import RegionalPopulationWidget from '../components/RegionalPopulationWidget';
import EducationROIWidget from '../components/EducationROIWidget';
import GenerationalInequalityWidget from '../components/GenerationalInequalityWidget';
import BullyingPreventionWidget from '../components/BullyingPreventionWidget';
import PersonalBurdenSimulator from '../components/PersonalBurdenSimulator';
import SocialInsuranceWedgeWidget from '../components/SocialInsuranceWedgeWidget';
import BirthCollapseAccelerationWidget from '../components/BirthCollapseAccelerationWidget';
import DigitalTradeDeficitWidget from '../components/DigitalTradeDeficitWidget';
import SectionJumpNav from '../components/SectionJumpNav';
import AnimatedBento, { AnimatedCard } from '../components/AnimatedBento';
import dynamic from 'next/dynamic';

const InfrastructureMap = dynamic(() => import('../components/InfrastructureMap'), {
    ssr: false,
    loading: () => <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>,
});

export default function Home() {
    const [introComplete, setIntroComplete] = useState(false);

    return (
        <>
            <IntroScreen onComplete={() => setIntroComplete(true)} />

            {introComplete && (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        style={{ paddingTop: '1.5rem', paddingBottom: '5rem' }}
                    >
                        <AnimatedBento>
                            {/* Regional Population Banner */}
                            <AnimatedCard id="section-hook" className="col-span-12" style={{ marginBottom: '-0.25rem' }}>
                                <RegionalPopulationWidget />
                            </AnimatedCard>

                            {/* SECTION 01 HEADER */}
                            <AnimatedCard className="col-span-12">
                                <div className="editorial-section-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.12em', color: '#93c5fd', background: 'rgba(37, 99, 235, 0.25)', padding: '3px 9px', borderRadius: '6px' }}>
                                            SECTION 01
                                        </span>
                                        <span className="outfit" style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                                            国家債務 1,346.7兆円と「日本円の購買力」の現在地
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                                        財務省・日銀・気象庁・地震情報
                                    </span>
                                </div>
                            </AnimatedCard>

                            {/* ROW 1 (Hook Layer): The Massive Debt Clock takes up 8 columns, Utilities take 4 */}
                            <AnimatedCard className="col-span-8">
                                <DebtClock />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ flex: 1 }}><WeatherWidget /></div>
                                <div style={{ flex: 2 }}><ExchangeRateWidget /></div>
                            </AnimatedCard>

                            {/* ROW 2: Earthquakes & News */}
                            <AnimatedCard className="col-span-6">
                                <EarthquakeMonitor />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-6">
                                <NewsWidget />
                            </AnimatedCard>

                            {/* SECTION 02 HEADER */}
                            <AnimatedCard id="section-simulator" className="col-span-12">
                                <div className="editorial-section-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.12em', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.25)', padding: '3px 9px', borderRadius: '6px' }}>
                                            SECTION 02
                                        </span>
                                        <span className="outfit" style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                                            個人の実質負担（五公五民）と手取り・賃金の停滞
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                                        年齢・年収別シミュレーション / 国税庁・厚労省統計
                                    </span>
                                </div>
                            </AnimatedCard>

                            {/* ROW 2.5: 1-Second Personal Burden & Lifetime Net Simulator */}
                            <AnimatedCard className="col-span-12">
                                <PersonalBurdenSimulator />
                            </AnimatedCard>

                            {/* ROW 3 (Personal Pain): Personal Debt & Income Stagnation */}
                            <AnimatedCard id="section-pain" className="col-span-4">
                                <PersonalDebtCounter />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4">
                                <AgeIncomeComparisonWidget />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4">
                                <RealWageWidget />
                            </AnimatedCard>

                            {/* ROW 4 (Financial Reality): Tax Balance, Social Insurance Wedge & Opportunity Cost */}
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <TaxBalanceTicker />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <SocialInsuranceWedgeWidget />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <OpportunityCostWidget />
                            </AnimatedCard>

                            {/* SECTION 03 HEADER */}
                            <AnimatedCard id="section-root-cause" className="col-span-12 below-fold-card">
                                <div className="editorial-section-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.12em', color: '#fdba74', background: 'rgba(249, 115, 22, 0.25)', padding: '3px 9px', borderRadius: '6px' }}>
                                            SECTION 03
                                        </span>
                                        <span className="outfit" style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                                            構造的根本原因：予算の非効率・世代間格差・デジタル赤字・シルバー民主主義
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                                        内閣府世代会計・文科省令和6年度確定値・国際収支統計
                                    </span>
                                </div>
                            </AnimatedCard>

                            {/* ROW 5 (Root Cause 1: Ineffective Spending & Generational Injustice) */}
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <EducationROIWidget />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <GenerationalInequalityWidget />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <BullyingPreventionWidget />
                            </AnimatedCard>

                            {/* ROW 6 (Root Cause 2: Power Dynamics & Metabolism) */}
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <CorporateMetabolismWidget />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <DecisionMakerAgeWidget />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <SilverDemocracyWidget />
                            </AnimatedCard>

                            {/* SECTION 04 HEADER */}
                            <AnimatedCard id="section-collapse" className="col-span-12 below-fold-card">
                                <div className="editorial-section-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.12em', color: '#c4b5fd', background: 'rgba(139, 92, 246, 0.25)', padding: '3px 9px', borderRadius: '6px' }}>
                                            SECTION 04
                                        </span>
                                        <span className="outfit" style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                                            出生数67万人ショック・デジタル国富流出・インフラ老朽化
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                                        厚労省人口動態統計(最新) / 国交省インフラ長寿命化計画
                                    </span>
                                </div>
                            </AnimatedCard>

                            {/* ROW 7 (Macro Demographics & Digital Drain) */}
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <PopulationTicker />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <BirthCollapseAccelerationWidget />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <DigitalTradeDeficitWidget />
                            </AnimatedCard>

                            {/* ROW 8 (Support Ratio & Disappearing Cities & Demographic Chart) */}
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <SupportRatioWidget />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <DisappearingCitiesWidget />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <DemographicChart />
                            </AnimatedCard>

                            {/* ROW 9 (Infrastructure Collapse) */}
                            <AnimatedCard className="col-span-8 below-fold-card" style={{ marginBottom: '1rem' }}>
                                <InfrastructureMap />
                            </AnimatedCard>
                            <AnimatedCard className="col-span-4 below-fold-card">
                                <InfrastructureStatusWidget />
                            </AnimatedCard>

                            {/* Bottom Row: Call to Action spans full width */}
                            <AnimatedCard className="col-span-12 below-fold-card">
                                <div className="widget" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                                    <h2 className="outfit" style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 800 }}>
                                        あなたの街と世代の「数字」を知っていますか？
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '640px', margin: '0 auto 2.5rem auto', lineHeight: 1.7 }}>
                                        公的債務1,346.7兆円、出生数67.1万人への急減、そして世代間の負担格差。客観的なデータから日本の構造課題を直視し、建設的な議論を始めるきっかけを作りましょう。
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                        <a
                                            href="https://twitter.com/intent/tweet?text=【日本の現在地】公的債務1,346.7兆円、出生数67.1万人、そして現役世代にのしかかる実質負担率。公的統計で日本の構造課題を可視化するダッシュボード。%20%23ミライノゼイ%20https://mirainozei.netlify.app"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="share-btn-light"
                                        >
                                            <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="currentColor">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path>
                                            </svg>
                                            X (Twitter) でシェアして問う
                                        </a>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </AnimatedBento>
                    </motion.div>
                    <SectionJumpNav />
                </>
            )}
        </>
    );
}
