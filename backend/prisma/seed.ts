import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const colleges = [
  ["IIT Delhi", "New Delhi", 230000, 4.9, "B.Tech Computer Science", ["Computer Science", "Electrical Engineering", "Mechanical Engineering"], 96, "A premier engineering institute known for research, entrepreneurship, and strong industry outcomes.", 1, 2500],
  ["IIT Bombay", "Mumbai", 240000, 4.9, "B.Tech Computer Science", ["Computer Science", "Electrical Engineering", "Chemical Engineering"], 97, "One of India's most competitive engineering campuses with exceptional placements and startup culture.", 1, 2200],
  ["IIT Kanpur", "Kanpur", 220000, 4.8, "B.Tech Aerospace Engineering", ["Computer Science", "Aerospace Engineering", "Electrical Engineering"], 94, "A research-driven institute with rigorous academics and deep engineering heritage.", 1, 4200],
  ["IIT Madras", "Chennai", 225000, 4.9, "B.Tech Mechanical Engineering", ["Computer Science", "Mechanical Engineering", "Civil Engineering"], 95, "A top-ranked institute with a green campus, strong labs, and excellent technical ecosystem.", 1, 3000],
  ["NIT Trichy", "Tiruchirappalli", 165000, 4.7, "B.Tech Computer Science", ["Computer Science", "Electronics and Communication", "Mechanical Engineering"], 91, "A leading NIT with strong alumni reach, placements, and national reputation.", 3000, 9000],
  ["NIT Surathkal", "Mangalore", 160000, 4.6, "B.Tech Information Technology", ["Information Technology", "Computer Science", "Civil Engineering"], 89, "A coastal engineering campus with strong technical culture and placement performance.", 5000, 13000],
  ["DTU", "New Delhi", 190000, 4.5, "B.Tech Software Engineering", ["Software Engineering", "Computer Science", "Mechanical Engineering"], 88, "A popular Delhi engineering university with strong industry access and active student societies.", 8000, 26000],
  ["NSUT", "New Delhi", 200000, 4.5, "B.Tech Computer Science", ["Computer Science", "Information Technology", "Electronics and Communication"], 87, "A sought-after state university known for technology programs and Delhi NCR opportunities.", 9000, 28000],
  ["IIIT Hyderabad", "Hyderabad", 330000, 4.8, "B.Tech Computer Science", ["Computer Science", "Electronics and Communication", "Computational Linguistics"], 96, "A focused technology institute with outstanding research and software engineering outcomes.", 1, 3500],
  ["VIT Vellore", "Vellore", 198000, 4.3, "B.Tech Computer Science", ["Computer Science", "Information Technology", "Biotechnology"], 82, "A large private university with diverse programs, modern facilities, and national intake.", 20000, 65000],
  ["SRM University", "Chennai", 250000, 4.1, "B.Tech Computer Science", ["Computer Science", "Electronics and Communication", "Mechatronics"], 78, "A private university offering broad engineering choices and strong campus infrastructure.", 35000, 85000],
  ["Manipal Institute of Technology", "Manipal", 315000, 4.4, "B.Tech Computer Science", ["Computer Science", "Data Science", "Mechanical Engineering"], 84, "A respected private engineering campus with strong student life and interdisciplinary exposure.", 15000, 52000],
  ["BITS Pilani", "Pilani", 520000, 4.8, "B.E. Computer Science", ["Computer Science", "Electrical and Electronics", "Chemical Engineering"], 93, "A prestigious private institute known for flexible academics, placements, and entrepreneurial culture.", 1, 6000],
  ["Jadavpur University", "Kolkata", 12000, 4.6, "B.E. Computer Science", ["Computer Science", "Electronics and Telecommunication", "Mechanical Engineering"], 86, "A high-value public university with excellent engineering reputation and low fees.", 3000, 18000],
  ["AKGEC Ghaziabad", "Ghaziabad", 145000, 4.0, "B.Tech Computer Science", ["Computer Science", "Information Technology", "Electronics and Communication"], 72, "A well-known NCR private college with practical engineering programs and placement focus.", 55000, 110000],
  ["KIET Ghaziabad", "Ghaziabad", 138000, 4.0, "B.Tech Information Technology", ["Information Technology", "Computer Science", "Electrical Engineering"], 74, "A regional engineering college with consistent academics and career support.", 50000, 105000],
  ["GL Bajaj", "Greater Noida", 132000, 3.9, "B.Tech Computer Science", ["Computer Science", "Artificial Intelligence", "Electronics and Communication"], 70, "A Greater Noida institute focused on employability, coding culture, and industry readiness.", 60000, 120000],
  ["Chandigarh University", "Mohali", 196000, 4.1, "B.Tech Computer Science", ["Computer Science", "Cloud Computing", "Mechanical Engineering"], 76, "A fast-growing private university with varied specializations and placement-oriented programs.", 40000, 95000],
  ["Amity University", "Noida", 280000, 4.0, "B.Tech Computer Science", ["Computer Science", "Aerospace Engineering", "Biotechnology"], 73, "A large private university with modern infrastructure and multidisciplinary exposure.", 65000, 130000],
  ["Lovely Professional University", "Phagwara", 168000, 4.0, "B.Tech Computer Science", ["Computer Science", "Robotics", "Civil Engineering"], 75, "A large private campus offering broad access, many engineering tracks, and placement support.", 45000, 125000]
] as const;

async function main() {
  await prisma.review.deleteMany();
  await prisma.cutoff.deleteMany();
  await prisma.college.deleteMany();

  for (const [name, location, fees, rating, mainCourse, courses, placementPercentage, description, minRank, maxRank] of colleges) {
    await prisma.college.create({
      data: {
        name,
        location,
        fees,
        rating,
        mainCourse,
        courses: [...courses],
        placementPercentage,
        description,
        imageUrl: `https://source.unsplash.com/900x600/?university,campus,${encodeURIComponent(location)}`,
        reviews: {
          create: [
            {
              studentName: "Aarav Sharma",
              rating: Math.min(5, rating),
              comment: "Strong academics, helpful seniors, and a placement process that rewards consistent preparation."
            },
            {
              studentName: "Meera Iyer",
              rating: Math.max(3.5, rating - 0.3),
              comment: "Good course choices and campus exposure. Hostel and admin experience can vary by department."
            }
          ]
        },
        cutoffs: {
          create: [
            { exam: "JEE", minRank, maxRank, course: mainCourse },
            { exam: "JEE", minRank: maxRank + 1, maxRank: maxRank + 20000, course: courses[1] ?? mainCourse }
          ]
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
