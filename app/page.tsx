'use client'
import { useEffect, useState, useRef } from 'react';
import ActionAreaCard from '../components/cards/customCard';
import style  from './projects.module.css'
import emailjs from '@emailjs/browser';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
    proId: number;
    proTitle: string;
    proDescription: string;
    proImage: string;
    proLink: string;
}

export default function Project() {
    const [pro, setPro] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Use relative URL instead of hardcoded localhost
    fetch(`/api/projects/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response;
    })
    .then((res) => res.json())
    .then((data) => {
        console.log('Fetched projects:', data); // Debug log
        setPro(data);
        setLoading(false);
    })
    .catch((error) => {
        console.error("Error fetching data from the API: ", error);
        setError(error.message);
        setLoading(false);
    });
  }, []);

  // Contact form validation and submission functions
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateLinkedIn = (linkedin: string) => {
    // regex to validate linkedin URL the ? at the end makes it optional
    const re = /^(https:\/\/www.linkedin.com\/in\/[a-zA-Z0-9_-]+\/?)?$/;
    return re.test(String(linkedin).toLowerCase());
  }

  const validateForm = (form: HTMLFormElement) => {
    const email = form.email_address.value;
    const name = form.from_name.value;
    const message = form.message.value;
    const linkedin = form.linkedin.value;

    if (name === "") {
      alert("Please enter your name.");
      return false;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (!validateLinkedIn(linkedin)) {
      alert("Please enter a valid LinkedIn URL.");
      return false;
    }

    if (message === "") {
      alert("Please enter a message.");
      return false;
    }

    return true;
  }

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.current) {
      if (!validateForm(form.current)) {
        return;
      }

      emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '', 
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '', 
        form.current, 
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
        )
        .then((result) => {
            console.log(result.text);
            alert("Message sent successfully!");
        }, (error) => {
            console.log(error.text);
            console.error("Error sending message: ", error);
        });
    }
  };

  // Show loading state
  if (loading) {
    return <div>Loading projects...</div>;
  }

  // Show error state
  if (error) {
    return <div>Error loading projects: {error}</div>;
  }

  // Debug log to see if data exists
  console.log('Current projects state:', pro);

  const customCard = pro.map((project) => {
    return (
        <ActionAreaCard
            key={project.proId}
            image={project.proImage}
            title={project.proTitle}
            description={project.proDescription}
            link={project.proLink}
        />
    );
  });

  return (
    <>
          {/* About Me Section */}
          <div id="about-section">
              <h1 className={style.title}>Yanheng Chen</h1>
              <h2 className={style.self_introduction}>
                    I am someone that loves to code and create things. 
                    I am a software engineer and 
                    I have worked on a variety of projects and I am always looking for new challenges. I am passionate about technology!
                </h2>

                <div className={style.techStack}>
                    <div className={style.techStackGrid}>
                        <div className={style.techItem}>
                            <img 
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" 
                                alt="Python" 
                                className={style.techLogo}
                            />
                            <span className={style.techName}>Python</span>
                        </div>
                        <div className={style.techItem}>
                            <img 
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" 
                                alt="C#" 
                                className={style.techLogo}
                            />
                            <span className={style.techName}>C#</span>
                        </div>
                        <div className={style.techItem}>
                            <img 
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" 
                                alt="JavaScript" 
                                className={style.techLogo}
                            />
                            <span className={style.techName}>JavaScript</span>
                        </div>
                        <div className={style.techItem}>
                            <img 
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" 
                                alt="React" 
                                className={style.techLogo}
                            />
                            <span className={style.techName}>React</span>
                        </div>
                        <div className={style.techItem}>
                            <img 
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" 
                                alt="Node.js" 
                                className={style.techLogo}
                            />
                            <span className={style.techName}>Node.js</span>
                        </div>
                        <div className={style.techItem}>
                            <img 
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" 
                                alt="TypeScript" 
                                className={style.techLogo}
                            />
                            <span className={style.techName}>TypeScript</span>
                        </div>
                        <div className={style.techItem}>
                            <img 
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" 
                                alt="MySQL" 
                                className={style.techLogo}
                            />
                            <span className={style.techName}>MySQL</span>
                        </div>
                        <div className={style.techItem}>
                            <img 
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg" 
                                alt=".NET" 
                                className={style.techLogo}
                            />
                            <span className={style.techName}>.NET</span>
                        </div>
                        <div className={style.techItem}>
                            <img 
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blazor/blazor-original.svg" 
                                alt="Blazor" 
                                className={style.techLogo}
                            />
                            <span className={style.techName}>Blazor</span>
                        </div>
                        <div className={style.techItem}>
                            <img 
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" 
                                alt="Next.js" 
                                className={style.techLogo}
                            />
                            <span className={style.techName}>Next.js</span>
                        </div>
                    </div>
                </div>
          </div>
          
          {/* Projects Section */}
          <div id="projects-section" className={style.container}>
              <div className={style.gridContainer}>
                  {pro.length === 0 ? (
                    <div>No projects found</div>
                  ) : (
                    customCard
                  )}
              </div>
          </div>

          {/* Contact Me Section */}
          <div id="contact-section" className={style.contactSection}>
              <div className={style.contactContainer}>
                  <div className={style.socialLinks}>
                      <Link href="https://www.linkedin.com/in/yan-chen-8a7a50211" target='blank' className={style.socialLink}>
                          <Image  
                              className={style.socialIcon}
                              width={60}
                              height={60}
                              src="/linkedin.svg" alt="Linkedin" />
                      </Link>

                      <Link href="https://github.com/Sparerow1" target='blank' className={style.socialLink}>
                          <Image  
                              className={style.socialIcon}
                              width={60}
                              height={60}
                              src="/github.svg" alt="Github" />
                      </Link>
                  </div>

                  <h1 className={style.contactTitle}>Contact Me</h1>
                  <fieldset className={style.contactFieldset}>
                      <form ref={form} onSubmit={sendEmail}>
                          <label className={style.contactLabel}> 
                              Name: *
                              <input type="text" className={style.contactInput} name="from_name"/>
                          </label>
                          
                          <label className={style.contactLabel}>
                              Email: *
                              <input type="email" className={style.contactInput} name='email_address'/>
                          </label>
                          
                          <label className={style.contactLabel}>
                              LinkedIn (optional):
                              <input type="text" className={style.contactInput} name='linkedin'/>
                          </label>
                          
                          <label className={style.contactLabel}>
                              Message: *
                              <textarea className={style.contactMessage} name='message'/>
                          </label>
                          
                          <button type="submit" className={style.contactSubmitButton}>Submit</button>
                      </form>
                  </fieldset>
              </div>
          </div>
      </>
  );
}
