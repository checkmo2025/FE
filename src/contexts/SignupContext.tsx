"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useRef, useMemo } from "react";

interface SignupState {
    // Terms
    agreements: Record<string, boolean>;
    // Email
    email: string;
    verificationCode: string;
    isVerified: boolean;
    timeLeft: number | null;
    // Password
    password: string;
    confirmPassword: string;
    // Profile
    nickname: string;
    intro: string;
    name: string;
    phone: string;
    isNicknameChecked: boolean;
    // Profile Image & Interests
    profileImage: string | null;
    isProfileImageSet: boolean; // Explicit check for whether user set an image or chose default
    selectedInterests: string[];
    // Toast
    toast: { message: string; visible: boolean } | null;
}

interface SignupActions {
    setAgreements: (agreements: Record<string, boolean>) => void;
    setEmail: (email: string) => void;
    setVerificationCode: (code: string) => void;
    setIsVerified: (verified: boolean) => void;
    setTimeLeft: (time: number | null) => void;
    setPassword: (password: string) => void;
    setConfirmPassword: (password: string) => void;
    setNickname: (nickname: string) => void;
    setIntro: (intro: string) => void;
    setName: (name: string) => void;
    setPhone: (phone: string) => void;
    setIsNicknameChecked: (checked: boolean) => void;
    setProfileImage: (image: string | null) => void;
    setIsProfileImageSet: (isSet: boolean) => void;
    setSelectedInterests: (interests: string[]) => void;
    showToast: (message: string) => void;
    resetSignup: () => void;
}

interface SignupContextType extends SignupState, SignupActions { }

const initialState: SignupState = {
    agreements: {},
    email: "",
    verificationCode: "",
    isVerified: false,
    timeLeft: null,
    password: "",
    confirmPassword: "",
    nickname: "",
    intro: "",
    name: "",
    phone: "",
    isNicknameChecked: false,
    profileImage: "/default_profile_1.svg",
    isProfileImageSet: false,
    selectedInterests: [],
    toast: null,
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<SignupState>(initialState);
    const toastTimers = useRef<NodeJS.Timeout[]>([]);

    const showToast = useCallback((message: string) => {
        // Clear existing timers
        toastTimers.current.forEach(clearTimeout);
        toastTimers.current = [];

        setState((prev) => ({ ...prev, toast: { message, visible: true } }));

        // Fade out after 2.5s
        const fadeOutTimer = setTimeout(() => {
            setState((prev) => prev.toast ? { ...prev, toast: { ...prev.toast, visible: false } } : prev);
        }, 2500);

        // Unmount after 3s
        const unmountTimer = setTimeout(() => {
            setState((prev) => ({ ...prev, toast: null }));
        }, 3000);

        toastTimers.current.push(fadeOutTimer, unmountTimer);
    }, []);

    const actions = useMemo((): SignupActions => ({
        setAgreements: (agreements) => setState((prev) => ({ ...prev, agreements })),
        setEmail: (email) => setState((prev) => ({ ...prev, email })),
        setVerificationCode: (verificationCode) => setState((prev) => ({ ...prev, verificationCode })),
        setIsVerified: (isVerified) => setState((prev) => ({ ...prev, isVerified })),
        setTimeLeft: (timeLeft) => setState((prev) => ({ ...prev, timeLeft })),
        setPassword: (password) => setState((prev) => ({ ...prev, password })),
        setConfirmPassword: (confirmPassword) => setState((prev) => ({ ...prev, confirmPassword })),
        setNickname: (nickname) => setState((prev) => ({ ...prev, nickname })),
        setIntro: (intro) => setState((prev) => ({ ...prev, intro })),
        setName: (name) => setState((prev) => ({ ...prev, name })),
        setPhone: (phone) => setState((prev) => ({ ...prev, phone })),
        setIsNicknameChecked: (isNicknameChecked) => setState((prev) => ({ ...prev, isNicknameChecked })),
        setProfileImage: (profileImage) => setState((prev) => ({ ...prev, profileImage })),
        setIsProfileImageSet: (isProfileImageSet) => setState((prev) => ({ ...prev, isProfileImageSet })),
        setSelectedInterests: (selectedInterests) => setState((prev) => ({ ...prev, selectedInterests })),
        showToast,
        resetSignup: () => setState(initialState),
    }), [showToast]);

    const contextValue = useMemo(() => ({ ...state, ...actions }), [state, actions]);

    return (
        <SignupContext.Provider value={contextValue}>
            {children}
        </SignupContext.Provider>
    );
};

export const useSignup = () => {
    const context = useContext(SignupContext);
    if (!context) {
        throw new Error("useSignup must be used within a SignupProvider");
    }
    return context;
};
