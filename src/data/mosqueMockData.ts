// src/data/mosqueMockData.ts
export const mosqueData = {
  id: "1",
  name: "Khiarpara Jame Masjid",
  established: "1972",
  description: "A vibrant community mosque serving Muslims in the area with daily prayers, educational programs, and community events. We strive to be a center for spiritual growth, education, and community service.",
  
  // Mosque Main Photo for Header
  mainPhoto: "https://images.unsplash.com/photo-1560983074-8c6f2c8ec93f?w=800&h=400&fit=crop",
  
  // Mosque History Data
  history: {
    background: `Khiarpara Jame Masjid was established in 1972 by a group of dedicated community members led by Haji Abdul Karim. The mosque was built on a 1.5 acre land donated by the local community. 

Originally starting as a small tin-shed structure, the mosque has undergone several expansions over the years. The first concrete building was constructed in 1985, and the current modern facility was completed in 2010.

The mosque has served as the spiritual and social hub for the Muslim community in Badargonj, providing religious education, social services, and community gatherings for over 50 years.`,

    landDetails: "1.5 acres of land",
    constructionDetails: "Three-phase construction (1972, 1985, 2010)",
    founder: "Haji Abdul Karim",
    foundingMembers: [
      "Haji Abdul Karim (Founder)",
      "Moulana Abdul Hamid (First Imam)", 
      "Haji Mohammad Ali",
      "Alhaj Abdur Razzak",
      "Alhaj Syed Ahmed"
    ],
    historicalPhotos: [
      {
        id: "1",
        title: "Original Tin-shed Mosque (1972)",
        caption: "The humble beginning of our mosque",
        url: "https://images.unsplash.com/photo-1631452180519-c014fe762e20?w=400&h=300&fit=crop"
      },
      {
        id: "2",
        title: "First Concrete Building (1985)", 
        caption: "First major expansion project",
        url: "https://images.unsplash.com/photo-1604874558040-94329397a639?w=400&h=300&fit=crop"
      },
      {
        id: "3",
        title: "Current Mosque Building (2010)",
        caption: "Modern facility with enhanced amenities", 
        url: "https://images.unsplash.com/photo-1560983074-8c6f2c8ec93f?w=400&h=300&fit=crop"
      }
    ]
  },

  // Mosque Gallery Images
  gallery: [
    {
      id: "1",
      title: "Main Entrance",
      url: "https://images.unsplash.com/photo-1560983074-8c6f2c8ec93f?w=400&h=300&fit=crop",
      description: "Beautiful architectural design of main entrance"
    },
    {
      id: "2",
      title: "Prayer Hall", 
      url: "https://images.unsplash.com/photo-1631452180519-c014fe762e20?w=400&h=300&fit=crop",
      description: "Spacious main prayer hall with modern facilities"
    },
    {
      id: "3", 
      title: "Minaret View",
      url: "https://images.unsplash.com/photo-1604874558040-94329397a639?w=400&h=300&fit=crop",
      description: "Tall minaret overlooking the community"
    },
    {
      id: "4",
      title: "Garden Area",
      url: "https://images.unsplash.com/photo-1587059327119-8df53ab8b8c4?w=400&h=300&fit=crop",
      description: "Well-maintained garden for community gatherings"
    },
    {
      id: "5",
      title: "Night View",
      url: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=400&h=300&fit=crop",
      description: "Mosque illuminated at night"
    }
  ],

  // Current Committee Members
  committeeMembers: [
    {
      id: "1",
      name: "Dr. Mohammad Rahman",
      designation: "President",
      phone: "01711223344",
      email: "president@khiarparamosque.org",
      bio: "Senior community leader with 20+ years of service",
      joinDate: "2015",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "2", 
      name: "Engr. Syed Hassan",
      designation: "General Secretary",
      phone: "01711223355", 
      email: "secretary@khiarparamosque.org",
      bio: "Civil engineer overseeing mosque development projects",
      joinDate: "2018",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "3",
      name: "Alhaj Ayesha Begum",
      designation: "Treasurer", 
      phone: "01711223366",
      email: "treasurer@khiarparamosque.org",
      bio: "Financial expert managing mosque funds",
      joinDate: "2016",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "4",
      name: "Moulana Omar Farooq", 
      designation: "Head Imam",
      phone: "01767313871",
      email: "imam@khiarparamosque.org", 
      bio: "Graduate of Islamic University of Madinah",
      joinDate: "2012",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "5",
      name: "Adv. Jamal Uddin",
      designation: "Legal Advisor",
      phone: "01711223377",
      email: "legal@khiarparamosque.org", 
      bio: "Legal expert providing guidance on religious matters",
      joinDate: "2019",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "6",
      name: "Mrs. Fatema Khan", 
      designation: "Women's Wing Coordinator",
      phone: "01711223388",
      email: "womenswing@khiarparamosque.org",
      bio: "Dedicated to women's religious education and activities", 
      joinDate: "2017",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ],

  // Rest of the existing data
  address: "Khiarpara, Badargonj, Rangpur",
  phone: "01575494393", 
  email: "milon.s2k21@gmail.com",
  imam: {
    name: "Omar Farooq",
    phone: "01767313871",
    bio: "Graduate of Islamic University of Madinah with 15 years of experience in community leadership and Islamic education.",
    email: "milon.s2k21@gmail.com",
  },
  services: [
    "Daily Five Prayers",
    "Jumuah Friday Prayer",
    "Quran Classes for All Ages", 
    "Islamic Studies Program",
    "Youth Activities",
    "Marriage Services",
    "Parking Facility",
    "Children's Play Area",
    "Kitchen Facilities",
    "Community Events",
  ],
  facilities: [
    "Main Prayer Hall (200 capacity)", 
    "Children's Room",
    "Parking Lot (10 cars)",
    "Garden Area",
  ]
};