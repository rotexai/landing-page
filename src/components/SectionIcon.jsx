import React from 'react';

const SectionIcon = ({ icon: Icon, className = '', style }) => {
    return (
        <div
            data-reveal
            style={style}
            className={`mx-auto mb-6 inline-flex h-[70px] w-[70px] items-center justify-center rounded-2xl border border-white/95 bg-white/[0.08] text-amber-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-1px_0_rgba(255,255,255,0.3),0_18px_45px_rgba(24,24,27,0.08)] ring-1 ring-white/70 backdrop-blur-2xl backdrop-saturate-150 ${className}`}
        >
            <Icon size={30} strokeWidth={2.4} />
        </div>
    );
};

export default SectionIcon;
