'use client';
import React, { useState, useId } from 'react';
import { motion } from 'framer-motion';
import WidgetFooter from './WidgetFooter';

export default function PersonalBurdenSimulator() {
    const ageSliderId = useId();
    const incomeSliderId = useId();

    const [age, setAge] = useState<number>(32);
    const [grossIncome, setGrossIncome] = useState<number>(450); // 万円

    // 1. Calculate True Tax & Social Security Burden (including Employer's hidden 15% share)
    // Employer pays ~15.5% of gross salary in Health/Pension/Child/Employment insurance
    const employerSocialIns = Math.round(grossIncome * 0.155);
    const totalLaborCost = grossIncome + employerSocialIns; // 会社が実際に払っている総人件費

    // Employee social insurance (~15.0%)
    const employeeSocialIns = Math.round(grossIncome * 0.15);

    // Income tax + Resident tax (progressive approximation for Japanese salary)
    const effectiveIncomeTaxRate =
        grossIncome <= 300 ? 0.055 :
        grossIncome <= 500 ? 0.085 :
        grossIncome <= 800 ? 0.135 :
        grossIncome <= 1100 ? 0.185 : 0.24;
    const incomeAndResidentTax = Math.round(grossIncome * effectiveIncomeTaxRate);

    // Take-home pay before consumption tax
    const nominalTakeHome = grossIncome - employeeSocialIns - incomeAndResidentTax;

    // Consumption tax (~7.2% of take-home spent on taxable goods)
    const consumptionTax = Math.round(nominalTakeHome * 0.072);

    const realDisposable = nominalTakeHome - consumptionTax;
    const totalPublicBurden = employerSocialIns + employeeSocialIns + incomeAndResidentTax + consumptionTax;
    const realBurdenRate = ((totalPublicBurden / totalLaborCost) * 100).toFixed(1);

    // 2. Lifetime Net Benefit / Burden (Generational Accounting interpolation by age & income factor)
    const incomeFactor = 0.75 + (grossIncome / 450) * 0.25;
    let baseLifetimeNet = 0; // 万円
    if (age < 25) baseLifetimeNet = -3200;
    else if (age < 35) baseLifetimeNet = -2750;
    else if (age < 45) baseLifetimeNet = -1800;
    else if (age < 55) baseLifetimeNet = -750;
    else if (age < 60) baseLifetimeNet = 150;
    else if (age < 70) baseLifetimeNet = 1650;
    else baseLifetimeNet = 4300;

    const lifetimeNet = Math.round(
        baseLifetimeNet >= 0
            ? baseLifetimeNet * (1 / Math.max(0.85, Math.min(1.25, incomeFactor * 0.9)))
            : baseLifetimeNet * incomeFactor
    );

    // 3. Political Vote Weight vs 70s generation (population * turnout ratio)
    const voteWeightRatio =
        age < 30 ? 0.23 :
        age < 40 ? 0.35 :
        age < 50 ? 0.52 :
        age < 60 ? 0.58 :
        age < 70 ? 0.66 : 1.0;

    const disposablePct = Math.round((realDisposable / totalLaborCost) * 100);
    const socialInsPct = Math.round(((employerSocialIns + employeeSocialIns) / totalLaborCost) * 100);
    const taxPct = 100 - disposablePct - socialInsPct;

    return (
        <div
            className="widget"
            style={{
                border: '1px solid rgba(37, 99, 235, 0.28)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(241,245,249,0.82) 100%)',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)', background: 'rgba(37, 99, 235, 0.1)', padding: '3px 10px', borderRadius: '999px', marginBottom: '0.4rem' }}>
                        🧮 1秒パーソナル診断シミュレーター
                    </div>
                    <h2 className="widget-title" style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>
                        あなたの「実質負担率（五公五民）」と「生涯損得」を試算
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                        スライダーを動かすと、給与明細に隠された「会社負担分の社会保険料」を含む本当の負担率と生涯純負担額がリアルタイムで判明します。
                    </p>
                </div>
            </div>

            {/* Interactive Controls + Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Column: Native Accessible Sliders */}
                <div className="lg:col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', background: 'rgba(255,255,255,0.75)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(148, 163, 184, 0.25)' }}>
                    {/* Age Slider */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                            <label htmlFor={ageSliderId} style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                現在の年齢
                            </label>
                            <span className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-blue)' }}>
                                {age} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>歳</span>
                            </span>
                        </div>
                        <input
                            id={ageSliderId}
                            type="range"
                            className="brand-range-slider"
                            min={18}
                            max={80}
                            step={1}
                            value={age}
                            aria-valuetext={`${age}歳`}
                            onChange={(e) => setAge(Number(e.target.value))}
                            style={{
                                '--attr-min': 18,
                                '--attr-max': 80,
                                '--control-value': age,
                                '--slider-fill-color': '#2563eb',
                            } as React.CSSProperties}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                            <span>18歳 (新成人)</span>
                            <span>45歳 (現役中核)</span>
                            <span>80歳 (受給世代)</span>
                        </div>
                    </div>

                    {/* Gross Income Slider */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                            <label htmlFor={incomeSliderId} style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                額面年収（税込）
                            </label>
                            <span className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-blue)' }}>
                                {grossIncome.toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>万円</span>
                            </span>
                        </div>
                        <input
                            id={incomeSliderId}
                            type="range"
                            className="brand-range-slider"
                            min={200}
                            max={1500}
                            step={25}
                            value={grossIncome}
                            aria-valuetext={`額面年収${grossIncome}万円`}
                            onChange={(e) => setGrossIncome(Number(e.target.value))}
                            style={{
                                '--attr-min': 200,
                                '--attr-max': 1500,
                                '--control-value': grossIncome,
                                '--slider-fill-color': '#ef4444',
                            } as React.CSSProperties}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                            <span>200万円</span>
                            <span>450万円 (中央値付近)</span>
                            <span>1,500万円</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Diagnostic KPI Cards & Stacked Breakdown */}
                <div className="lg:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Card 1: Real Burden Rate */}
                        <div style={{ background: 'rgba(239, 68, 68, 0.07)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '14px', padding: '0.9rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                実質公的負担率（総人件費比）
                            </div>
                            <motion.div
                                key={realBurdenRate}
                                initial={{ scale: 1.06 }}
                                animate={{ scale: 1 }}
                                className="tabular-nums"
                                style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent-red)', lineHeight: 1.15, marginTop: '0.2rem' }}
                            >
                                {realBurdenRate}%
                            </motion.div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                年間 <strong style={{ color: 'var(--accent-red)' }}>約{totalPublicBurden}万円</strong> が公的徴収
                            </div>
                        </div>

                        {/* Card 2: Lifetime Net Benefit/Loss */}
                        <div style={{ background: lifetimeNet >= 0 ? 'rgba(37, 99, 235, 0.08)' : 'rgba(239, 68, 68, 0.07)', border: `1px solid ${lifetimeNet >= 0 ? 'rgba(37, 99, 235, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`, borderRadius: '14px', padding: '0.9rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                生涯の純受益・純負担（推計）
                            </div>
                            <motion.div
                                key={lifetimeNet}
                                initial={{ scale: 1.06 }}
                                animate={{ scale: 1 }}
                                className="tabular-nums"
                                style={{ fontSize: '1.65rem', fontWeight: 900, color: lifetimeNet >= 0 ? 'var(--accent-blue)' : 'var(--accent-red)', lineHeight: 1.15, marginTop: '0.2rem' }}
                            >
                                {lifetimeNet > 0 ? `+${lifetimeNet.toLocaleString()}` : lifetimeNet.toLocaleString()}万円
                            </motion.div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                {lifetimeNet >= 0 ? '世代会計上「受益超過（もらい得）」' : '世代会計上「負担超過（払い損）」'}
                            </div>
                        </div>

                        {/* Card 3: Vote Power */}
                        <div style={{ background: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.25)', borderRadius: '14px', padding: '0.9rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                政治家から見た票の影響力
                            </div>
                            <div className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent-orange)', lineHeight: 1.15, marginTop: '0.2rem' }}>
                                {voteWeightRatio}倍
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                70代以上の票数を「1.0」とした場合
                            </div>
                        </div>
                    </div>

                    {/* Visual Stacked Bar of Total Labor Cost */}
                    <div style={{ background: 'rgba(255,255,255,0.75)', padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)', flexWrap: 'wrap', gap: '4px' }}>
                            <span>会社があなたに払う総人件費: 約 {totalLaborCost.toLocaleString()} 万円/年</span>
                            <span style={{ color: 'var(--accent-blue)' }}>実質自由になるお金: 約 {realDisposable.toLocaleString()} 万円 ({disposablePct}%)</span>
                        </div>

                        {/* Stacked Bar */}
                        <div style={{ display: 'flex', height: '18px', borderRadius: '999px', overflow: 'hidden', width: '100%', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)' }}>
                            <div
                                style={{ width: `${disposablePct}%`, background: 'linear-gradient(90deg, #2563eb, #60a5fa)', transition: 'width 0.3s ease' }}
                                title={`実質可処分所得: ${realDisposable}万円`}
                            />
                            <div
                                style={{ width: `${socialInsPct}%`, background: 'linear-gradient(90deg, #ef4444, #f87171)', transition: 'width 0.3s ease' }}
                                title={`社会保険料(本人+会社): ${employerSocialIns + employeeSocialIns}万円`}
                            />
                            <div
                                style={{ width: `${taxPct}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', transition: 'width 0.3s ease' }}
                                title={`所得税・住民税・消費税: ${incomeAndResidentTax + consumptionTax}万円`}
                            />
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#2563eb' }}></span>
                                実質手取り: <strong>{realDisposable}万円 ({disposablePct}%)</strong>
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444' }}></span>
                                社会保険料(労使計): <strong>{employerSocialIns + employeeSocialIns}万円 ({socialInsPct}%)</strong>
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b' }}></span>
                                所得・住民・消費税: <strong>{incomeAndResidentTax + consumptionTax}万円 ({taxPct}%)</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <WidgetFooter
                sourceName="財務省「国民負担率」/ 内閣府「世代会計」推計モデル"
                sourceUrl="https://www.mof.go.jp/policy/budget/topics/futanritsu/index.htm"
                shareText={`【1秒診断】${age}歳・額面年収${grossIncome}万円の場合、会社負担分を含めた実質公的負担率は「${realBurdenRate}%（年間約${totalPublicBurden}万円）」、生涯純負担は「${lifetimeNet > 0 ? '+' : ''}${lifetimeNet}万円」でした。`}
            />
        </div>
    );
}
