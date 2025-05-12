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

const certificationFilter = document.getElementById("certificationFilter");

const subjects = ['All', 'CSE', 'WDD'];

// Create filter buttons
subjects.forEach(subject => {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = subject;

    link.addEventListener("click", (e) => {
        e.preventDefault();

        const filtered = subject === "All"
            ? courses
            : courses.filter(c => c.subject === subject);

        displayCourses(filtered);
    });

    certificationFilter.appendChild(link);
});

function displayCourses(courseList) {
    certificateSection.innerHTML = "";

    if (courseList.length === 0) {
        certificateSection.innerHTML = "<p>No courses found for the selected filter.</p>";
        return;
    }

    courseList.forEach(course => {
        const courseCard = document.createElement("div");

        courseCard.className = `course-card ${course.completed ? "completed" : "pending"}`;

        courseCard.innerHTML = `
            <h2>${course.title}</h2>
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

    let totalDiv = document.getElementById("total-credits");

    if (!totalDiv) {
        totalDiv = document.createElement("div");
        totalDiv.id = "total-credits";
        certificateSection.appendChild(totalDiv);
    }

    totalDiv.innerHTML = `<strong>Total Credits:</strong> ${totalCredits}`;
}

// Initial display
displayCourses(courses);