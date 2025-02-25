// src/app/components/GlobalTimer.js
"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { completePhase, startBreak, endBreak } from "../store/examSlice";

const GlobalTimer = ({ phase, onTimeUp }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const globalTimer = useSelector((state) => state.exam.globalTimer);
  const paused = useSelector((state) => state.exam.paused);
  const breakTime = useSelector((state) => state.exam.breakTime);

  const [remainingTime, setRemainingTime] = useState(0);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0);

  useEffect(() => {
    // Handle break time
    if (breakTime) {
      setIsBreakTime(true);
      const elapsedBreakTime = Math.floor(
        (Date.now() - breakTime.startTime) / 1000
      );
      const timeLeft = Math.max(0, breakTime.duration - elapsedBreakTime);
      setBreakTimeRemaining(timeLeft);
    } else {
      setIsBreakTime(false);
    }
  }, [breakTime]);

  // Timer for exam
  useEffect(() => {
    if (globalTimer && !paused && !isBreakTime) {
      const updateRemainingTime = () => {
        const currentTime = Date.now();
        const timeLeft = Math.max(
          0,
          Math.floor((globalTimer.endTime - currentTime) / 1000)
        );
        setRemainingTime(timeLeft);
        return timeLeft;
      };

      // Initial calculation
      const timeLeft = updateRemainingTime();

      // If time is already up
      if (timeLeft <= 0) {
        if (onTimeUp) onTimeUp();
        return;
      }

      const timer = setInterval(() => {
        const remaining = updateRemainingTime();
        if (remaining <= 0) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [globalTimer, paused, isBreakTime, onTimeUp]);

  // Timer for break
  useEffect(() => {
    if (isBreakTime && breakTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBreakTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            dispatch(endBreak());
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBreakTime, breakTimeRemaining, dispatch]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Determine if time is running low (less than 1 minute)
  const isTimeRunningLow = remainingTime > 0 && remainingTime < 60;

  if (isBreakTime) {
    return (
      <div className="flex items-center gap-2 bg-amber-100 px-3 py-1.5 rounded-lg">
        <svg
          className="w-5 h-5 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className={`text-lg font-bold text-amber-600`}>
          {formatTime(breakTimeRemaining)}
        </span>
        <span className="text-amber-600 text-sm hidden sm:inline">
          فترة راحة
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
        isTimeRunningLow ? "bg-red-100" : "bg-blue-100"
      }`}
    >
      <svg
        className={`w-5 h-5 ${
          isTimeRunningLow ? "text-red-600" : "text-blue-600"
        } ${remainingTime < 10 ? "animate-pulse" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span
        className={`text-lg font-bold ${
          isTimeRunningLow ? "text-red-600" : "text-blue-600"
        }`}
      >
        {formatTime(remainingTime)}
      </span>
    </div>
  );
};

export default GlobalTimer;
