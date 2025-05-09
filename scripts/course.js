const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development...',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient...',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects...',
        technology: ['C#'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Students will learn to create dynamic websites that use JavaScript...',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Students will focus on user experience, accessibility...',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];

const certificateSection = document.getElementById("courseContent");

function displayCourses(courseList) {
    certificateSection.innerHTML = "";

    courseList.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.className = `course-card ${course.completed ? "completed" : "pending"}`;
        courseCard.innerHTML = `
            <h3>${course.title}</h3>
            <p><strong>Category:</strong> ${course.subject}</p>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p><strong>Technologies:</strong> ${course.technology.join(", ")}</p>
            <p><strong>Status:</strong> ${course.completed ? "✅ Completed" : "⏳ In Progress"}</p>
        `;
        certificateSection.appendChild(courseCard);
    });

    updateTotalCredits(courseList);
}

function updateTotalCredits(courseList) {
    let totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
    const totalDiv = document.createElement("div");
    totalDiv.id = "total-credits";
    totalDiv.innerHTML = `<strong>Total Credits:</strong> ${totalCredits}`;
    certificateSection.appendChild(totalDiv);
}

displayCourses(courses);
