import { createElement } from "react";
import {
  FiUsers,
  FiCalendar,
  FiActivity,
  FiDollarSign,
  FiMail,
  FiBarChart2,
} from "react-icons/fi";

export const FEATURES = [
  {
    icon: createElement(FiUsers),
    en: {
      title: "Patient Records",
      desc: "Complete medical history, allergies, insurance and emergency contacts — all searchable in seconds.",
    },
    bn: {
      title: "রোগীর রেকর্ড",
      desc: "সম্পূর্ণ মেডিকেল ইতিহাস, অ্যালার্জি, বিমা ও জরুরি যোগাযোগ — সেকেন্ডে খুঁজে পান।",
    },
  },
  {
    icon: createElement(FiCalendar),
    en: {
      title: "Smart Scheduling",
      desc: "Book, reschedule and manage appointments across multiple dentists and chairs — no double-bookings ever.",
    },
    bn: {
      title: "স্মার্ট শিডিউলিং",
      desc: "একাধিক ডেন্টিস্ট ও চেয়ারে অ্যাপয়েন্টমেন্ট বুক ও পরিচালনা করুন — ডাবল বুকিং কখনো না।",
    },
  },
  {
    icon: createElement(FiActivity),
    en: {
      title: "Chair & Room Management",
      desc: "See every chair's live status at a glance. Assign patients automatically or override manually.",
    },
    bn: {
      title: "চেয়ার ও রুম ম্যানেজমেন্ট",
      desc: "এক নজরে প্রতিটি চেয়ারের লাইভ স্ট্যাটাস দেখুন। স্বয়ংক্রিয়ভাবে বা ম্যানুয়ালি রোগী নির্ধারণ করুন।",
    },
  },
  {
    icon: createElement(FiDollarSign),
    en: {
      title: "Billing & Invoicing",
      desc: "Generate itemised invoices per visit, track payment status and keep your revenue organised.",
    },
    bn: {
      title: "বিলিং ও ইনভয়েসিং",
      desc: "প্রতিটি ভিজিটের জন্য বিস্তারিত ইনভয়েস তৈরি করুন এবং পেমেন্ট স্ট্যাটাস ট্র্যাক করুন।",
    },
  },
  {
    icon: createElement(FiMail),
    en: {
      title: "Automated Reminders",
      desc: "SMS and email reminders reduce no-shows and keep patients arriving on schedule, automatically.",
    },
    bn: {
      title: "স্বয়ংক্রিয় রিমাইন্ডার",
      desc: "এসএমএস ও ইমেইল রিমাইন্ডার স্বয়ংক্রিয়ভাবে নো-শো কমিয়ে আনে।",
    },
  },
  {
    icon: createElement(FiBarChart2),
    en: {
      title: "Dashboard & Reports",
      desc: "Daily, weekly and monthly snapshots of revenue, patient flow and treatment trends — no spreadsheets needed.",
    },
    bn: {
      title: "ড্যাশবোর্ড ও রিপোর্ট",
      desc: "রাজস্ব, রোগীর প্রবাহ ও চিকিৎসার প্রবণতার দৈনিক, সাপ্তাহিক ও মাসিক রিপোর্ট।",
    },
  },
];

export const STEPS = [
  {
    en: {
      title: "Create your clinic profile",
      desc: "Enter your clinic name, address and working hours. Add dentists and chairs — takes about 3 minutes.",
    },
    bn: {
      title: "আপনার ক্লিনিকের প্রোফাইল তৈরি করুন",
      desc: "ক্লিনিকের নাম, ঠিকানা ও কর্মঘণ্টা দিন। ডেন্টিস্ট ও চেয়ার যোগ করুন — মাত্র ৩ মিনিট।",
    },
  },
  {
    en: {
      title: "Import or add your patients",
      desc: "Add patients one by one or bulk-import from a CSV. Medical history and insurance captured from day one.",
    },
    bn: {
      title: "রোগী যোগ করুন বা আমদানি করুন",
      desc: "একে একে বা CSV দিয়ে বাল্ক আমদানি করুন। মেডিকেল ইতিহাস প্রথম দিন থেকেই সংরক্ষিত হয়।",
    },
  },
  {
    en: {
      title: "Book your first appointment",
      desc: "Pick a patient, dentist, treatment type and time slot. DentFlow checks for conflicts and assigns a chair.",
    },
    bn: {
      title: "প্রথম অ্যাপয়েন্টমেন্ট বুক করুন",
      desc: "রোগী, ডেন্টিস্ট, চিকিৎসার ধরন ও সময় বেছে নিন। DentFlow স্বয়ংক্রিয়ভাবে চেয়ার নির্ধারণ করে।",
    },
  },
  {
    en: {
      title: "DentFlow handles the rest",
      desc: "Reminders go out automatically, invoices are generated after each visit, and your dashboard updates in real time.",
    },
    bn: {
      title: "বাকিটা DentFlow সামলায়",
      desc: "রিমাইন্ডার স্বয়ংক্রিয়ভাবে যায়, ইনভয়েস তৈরি হয়, ড্যাশবোর্ড রিয়েল টাইমে আপডেট হয়।",
    },
  },
];

export const PREVIEW_PATIENTS = [
  {
    initials: "RK",
    name: "Rahim Khan",
    meta: "10:00 AM · Root Canal · Dr. Sultana",
    statusEn: "Confirmed",
    statusBn: "নিশ্চিত",
    color: "#dcfce7",
    text: "#15803d",
  },
  {
    initials: "FA",
    name: "Fatima Ahmed",
    meta: "11:30 AM · Scaling · Dr. Islam",
    statusEn: "Pending",
    statusBn: "অপেক্ষমাণ",
    color: "#fef9c3",
    text: "#854d0e",
  },
  {
    initials: "MH",
    name: "Masud Hossain",
    meta: "09:00 AM · Extraction · Dr. Sultana",
    statusEn: "Done",
    statusBn: "সম্পন্ন",
    color: "#e6ebf5",
    text: "#002972",
  },
];
