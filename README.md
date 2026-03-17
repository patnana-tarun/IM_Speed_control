# User-Interactive STM32 Closed-Loop V/f Induction Motor Control

A professional, industrial-grade telemetry and control platform for three-phase induction motors. This project combines high-performance **STM32 firmware** with a modern **React 19** dashboard to provide real-time scalar $V/f$ control, active safety monitoring, and precision speed regulation.

---

## 📖 Table of Contents

* [Project Overview](https://www.google.com/search?q=%23project-overview)
* [Hardware Specifications](https://www.google.com/search?q=%23hardware-specifications)
* [Control & Safety Features](https://www.google.com/search?q=%23control--safety-features)
* [Dashboard Tech Stack](https://www.google.com/search?q=%23dashboard-tech-stack)
* [Installation](https://www.google.com/search?q=%23installation)
* [Usage & Telemetry](https://www.google.com/search?q=%23usage--telemetry)
* [Credits](https://www.google.com/search?q=%23credits)

---

## 📝 Project Overview

This system implements a **Closed-Loop Variable Frequency Drive (VFD)** to control a 0.75 kW induction motor. By maintaining a constant Voltage-to-Frequency ($V/f$) ratio, the controller ensures constant air-gap flux and torque across a wide speed range (0–1500 RPM).

**Why this project?**

* **Precision Feedback**: Uses an inductive proximity sensor and PI control for accurate RPM regulation.
* **Hardware-Level Safety**: Real-time RMS monitoring for overcurrent and undervoltage protection.
* **Industrial Readiness**: Implements 10 kHz SPWM with dead-time insertion to protect inverter hardware.

---

## ⚙️ Hardware Specifications

The system is built on a modular architecture consisting of the following core components:

1. Control & Processing 

* **Microcontroller**: STM32F401RE (ARM Cortex-M4 @ 84 MHz).
* **PWM Generation**: 10 kHz Sinusoidal PWM (SPWM) via Advanced Timer (TIM1).
* **Baud Rate**: High-speed UART communication at **230400** for real-time telemetry.

2. Power Electronics 

* **Inverter**: 3-Phase Two-Level Voltage Source Inverter.
* **Power Switches**: IRFP460N MOSFETs.
* **Motor**: 0.75 kW, 415 V, 1.9 A, 4-Pole Induction Motor (1440 RPM base speed).

3. Sensing & Feedback 

* **Current Sensing**: ACS712 Hall-Effect sensor for RMS current measurement.
* **Voltage Sensing**: ZMPT101B for RMS output voltage monitoring.
* **Speed Feedback**: Inductive Proximity Sensor for pulse-based RPM estimation.

---

## ✨ Control & Safety Features

* **Adaptive Soft-Start**: State machine-based frequency ramping (2 Hz to target) to prevent high inrush currents and mechanical stress.
* **Closed-Loop PI Control**: Proportional-Integral algorithm to eliminate steady-state error under varying loads.
* **Advanced Filtering**: Exponential Moving Average (EMA) filter on RPM data to ensure stable control signals.


* **Integrated Protection**:
* **Overcurrent**: Immediate PWM disable if current exceeds predefined thresholds.
* **Undervoltage**: Disables inverter during supply dips to prevent unstable operation.
* **RPM Timeout**: Safety shutdown if the sensor fails to detect rotation.
* **Emergency Stop**: UART-triggered "KILL" command for instant shutdown.

---

## 💻 Dashboard Tech Stack

The "MotorCtrl" frontend is a high-performance web dashboard that leverages the **Web Serial API** for driverless hardware interaction.

* **Framework**: React 19.
* **Build Tool**: Vite (for optimized asset delivery).
* **Styling**: Tailwind CSS 4.0 (for responsive, industrial UI).
* **Visualization**: Real-time gauges and multi-parameter history charts.

---

## 🚀 Installation

### Prerequisites

* [Node.js](https://nodejs.org/) (v18.0+)
* Browser with **Web Serial** support (Chrome, Edge)
* STM32 Nucleo-F401RE board

### Step 1: Clone & Setup

```bash
git clone https://github.com/Premchand006/Speed-control.git
cd Speed-control

```

### Step 2: Install Dependencies

```bash
npm install

```

### Step 3: Launch

```bash
npm run dev

```

---

## 🛠️ Usage & Telemetry

### Data Input Format (STM32 to Dashboard)

The dashboard expects a comma-separated string at **230400 baud**:
`V:xx.xx, I:xx.xx, S:xxxx, F:xx.xx` 

* `V`: RMS Voltage 
* `I`: RMS Current 
* `S`: Speed (RPM) 
* `F`: Inverter Frequency (Hz) 

### Control Commands (Dashboard to STM32)

* **Set Speed**: `S:<val>\n` (e.g., `S:1500`)
* **Emergency Stop**: `KILL\n` 
* **Reset Safety**: `RESET\n`

---

## 💎 Credits

Developed by the **Department of Electrical and Electronics Engineering**, Amrita School of Engineering, Coimbatore.

Project Team:
* Chalapala Sowmya (CB.EN.U4ELC23014) 
* Korukonda LKM Premchand (CB.EN.U4ELC23024) 
* Lalitha Saranya Pathi (CB.EN.U4ELC23025) 
* Patnana Tarun (CB.EN.U4ELC23034) 
**Guide:** Dr. P Supriya, Professor, EEE Department.

---
