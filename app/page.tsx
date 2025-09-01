'use client'
import { useEffect, useState } from 'react';
import ActionAreaCard from '../components/cards/customCard';
import style  from './projects.module.css'

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
          <div>
              <h1 className={style.title}>Projects</h1>
              <h2 className={style.self_introduction}>
                    I am someone that loves to code and create things. 
                    I am a software engineer and 
                    I have worked on a variety of projects and I am always looking for new challenges. I am passionate about technology
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
          
          <div className={style.container}>
              <div className={style.gridContainer}>
                  {pro.length === 0 ? (
                    <div>No projects found</div>
                  ) : (
                    customCard
                  )}
              </div>
          </div>
      </>
  );
}
