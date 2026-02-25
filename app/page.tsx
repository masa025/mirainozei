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
import AnimatedBento, { AnimatedCard } from '../components/AnimatedBento';
import dynamic from 'next/dynamic';

const InfrastructureMap = dynamic(() => import('../components/InfrastructureMap'), {
    ssr: false,
    loading: () => <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>
});

export default function Home() {
    const [introComplete, setIntroComplete] = useState(false);

    return (
        <>
            <IntroScreen onComplete={() => setIntroComplete(true)} />

            {/* Only mount the dashboard once the intro is complete (or fading out) to trigger the Bento enter animations beautifully */}
            {introComplete && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ paddingTop: '2rem' }}
                >
                    <AnimatedBento>
                        {/* ROW 1: The Massive Debt Clock takes up 8 columns, Utilities take 4 */}
                        <AnimatedCard className="col-span-8">
                            <DebtClock />
                        </AnimatedCard>

                        {/* Small Utilities stacked on the right */}
                        <AnimatedCard className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ flex: 1 }}><WeatherWidget /></div>
                            <div style={{ flex: 2 }}><ExchangeRateWidget /></div>
                        </AnimatedCard>

                        {/* ROW 2: Personal Shock & Massive Racing Bar */}
                        <AnimatedCard className="col-span-4">
                            <PersonalDebtCounter />
                        </AnimatedCard>
                        <AnimatedCard className="col-span-8">
                            <TaxBalanceTicker />
                        </AnimatedCard>

                        {/* ROW 3: Demographics (Population, Support Ratio, Disappearing Cities) */}
                        <AnimatedCard className="col-span-4">
                            <PopulationTicker />
                        </AnimatedCard>
                        <AnimatedCard className="col-span-4">
                            <SupportRatioWidget />
                        </AnimatedCard>
                        <AnimatedCard className="col-span-4">
                            <DisappearingCitiesWidget />
                        </AnimatedCard>

                        {/* ROW 4: Context & Deep Dive (Demographics Chart + Opportunity Cost + Silver Democracy) */}
                        <AnimatedCard className="col-span-8">
                            <DemographicChart />
                        </AnimatedCard>
                        <AnimatedCard className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <OpportunityCostWidget />
                            <SilverDemocracyWidget />
                        </AnimatedCard>

                        {/* ROW 5: Infrastructure (Map + Realtime Status) */}
                        <AnimatedCard className="col-span-8" style={{ marginBottom: '1rem' }}>
                            <InfrastructureMap />
                        </AnimatedCard>
                        <AnimatedCard className="col-span-4">
                            <InfrastructureStatusWidget />
                        </AnimatedCard>

                        {/* ROW 6: Real-time Events (News + Earthquakes) */}
                        <AnimatedCard className="col-span-6">
                            <NewsWidget />
                        </AnimatedCard>
                        <AnimatedCard className="col-span-6">
                            <EarthquakeMonitor />
                        </AnimatedCard>

                        {/* Bottom Row: Call to Action spans full width */}
                        <AnimatedCard className="col-span-12">
                            <div className="widget" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                                <h2 className="outfit" style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 800 }}>あなたの街の「数字」を知っていますか？</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                                    このダッシュボードのデータは、毎秒更新される日本の現実です。この「機会損失」を止め、建設的な議論を始めるきっかけを作りましょう。
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    <a
                                        href="https://twitter.com/intent/tweet?text=【最新】1人あたりの国の借金も、円の価値もリアルタイムで変動中。そして地震は待ってくれません。このダッシュボードで日々進行する「日本の現実」を確認しよう。%20%23ミライノゼイ%20https://mirainozei.netlify.app"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-btn-light"
                                    >
                                        <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></svg>
                                        X (Twitter) でシェアして問う
                                    </a>
                                    <a
                                        href="https://x.com/mirainozei"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-btn-outline"
                                    >
                                        公式Xアカウントをフォロー
                                    </a>
                                </div>
                            </div>
                        </AnimatedCard>
                    </AnimatedBento>
                </motion.div>
            )}
        </>
    );
}
