// src/data/mosqueMockData.ts
export const mosqueData = {
  id: "1",
  name: "Khiarpara Jame Masjid",
  established: "1972",
  description: "A vibrant community mosque serving Muslims in the area with daily prayers, educational programs, and community events. We strive to be a center for spiritual growth, education, and community service.",
  
  // Mosque Main Photo for Header
  mainPhoto: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313939/front_part_qkusao.jpg",
  
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
        url: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313939/front_part_qkusao.jpg"
      },
      {
        id: "2",
        title: "First Concrete Building (1985)", 
        caption: "First major expansion project",
        url: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313939/back_part_hyjl5g.jpg"
      },
      {
        id: "3",
        title: "Current Mosque Building (2010)",
        caption: "Modern facility with enhanced amenities", 
        url: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313939/back_part2_ucnv4q.jpg"
      }
    ]
  },

  // Mosque Gallery Images
  gallery: [
    {
      id: "1",
      title: "Main Entrance",
      url: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313939/front_part_qkusao.jpg",
      description: "Beautiful architectural design of main entrance"
    },
    {
      id: "2",
      title: "Prayer Hall", 
      url: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313939/back_part_hyjl5g.jpg",
      description: "Spacious main prayer hall with modern facilities"
    },
    {
      id: "3", 
      title: "Minaret View",
      url: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313939/back_part2_ucnv4q.jpg",
      description: "Tall minaret overlooking the community"
    },
    {
      id: "4",
      title: "Garden Area",
      url: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313939/back_part2_ucnv4q.jpg",
      description: "Well-maintained garden for community gatherings"
    },
    {
      id: "5",
      title: "Night View",
      url: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313939/back_part2_ucnv4q.jpg",
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
      photo: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313945/new_pxkwiq.jpg"
    },
    {
      id: "2", 
      name: "Engr. Syed Hassan",
      designation: "General Secretary",
      phone: "01711223355", 
      email: "secretary@khiarparamosque.org",
      bio: "Civil engineer overseeing mosque development projects",
      joinDate: "2018",
      photo: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313939/shajedul_drwm7x.jpg"
    },
    {
      id: "3",
      name: "Shajedul Islam",
      designation: "Treasurer", 
      phone: "01711223366",
      email: "treasurer@khiarparamosque.org",
      bio: "Financial expert managing mosque funds",
      joinDate: "2016",
      photo: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313939/shajedul_drwm7x.jpg"
    },
    {
      id: "4",
      name: "Moulana Omar Farooq", 
      designation: "Head Imam",
      phone: "01767313871",
      email: "imam@khiarparamosque.org", 
      bio: "Graduate of Islamic University of Madinah",
      joinDate: "2012",
      photo: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313938/photo_2023-09-07_19-35-42_s2livt.png"
    },
    {
      id: "5",
      name: "Adv. Jamal Uddin",
      designation: "Legal Advisor",
      phone: "01711223377",
      email: "legal@khiarparamosque.org", 
      bio: "Legal expert providing guidance on religious matters",
      joinDate: "2019",
      photo: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313945/new_pxkwiq.jpg"
    },
    {
      id: "6",
      name: "Milon Mia", 
      designation: "Vice President",
      phone: "01711223388",
      email: "milon.mia@khiarparamosque.org",
      bio: "Dedicated to women's religious education and activities",
      joinDate: "2017",
      photo: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313945/new_pxkwiq.jpg"
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
    photo: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313938/photo_2023-09-07_19-35-42_s2livt.png"
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