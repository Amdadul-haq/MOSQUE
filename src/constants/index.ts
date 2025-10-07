export const Colors = {
  primary: '#16a34a',
  accent: '#facc15',
  background: {
    light: '#f9fafb',
    dark: '#111111'
  },
  text: {
    light: '#1f2937',
    dark: '#ffffff'
  }
};

export const DummyData = {
  donations: [
    { id: '1', amount: 100, type: 'Zakat', date: '2024-01-15', donor: 'Ahmed Khan' },
    { id: '2', amount: 50, type: 'Sadaqah', date: '2024-01-14', donor: 'Fatima Ali' },
    { id: '3', amount: 200, type: 'Construction', date: '2024-01-10', donor: 'Mohammed Hassan' },
    { id: '4', amount: 75, type: 'General', date: '2024-01-08', donor: 'Aisha Rahman' },
  ],
  events: [
    { id: '1', title: 'Friday Prayer', date: '2024-01-19', time: '13:00' },
    { id: '2', title: 'Quran Class', date: '2024-01-20', time: '17:00' },
    { id: '3', title: 'Community Iftar', date: '2024-01-25', time: '18:30' },
  ],
  mosqueInfo: {
    name: 'Al-Masjid Al-Jamia',
    address: '123 Islamic Street, Green City, GC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@almasjid.org',
    imam: {
      name: 'Dr. Ibrahim Al-Mansoor',
      bio: 'Graduated from Islamic University of Madinah with 15 years of experience.',
      phone: '+1 (555) 123-4568'
    },
    prayerTimes: {
      fajr: '05:30',
      dhuhr: '12:30',
      asr: '15:45',
      maghrib: '17:20',
      isha: '19:00'
    }
  }
};