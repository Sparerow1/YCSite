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
              <h2  className={style.self_introduction}>
                I am someone that loves to code and create things. 
                I am a software engineer and 
                I have worked on a variety of projects and I am always looking for new challenges. I am passionate about technology
              </h2>
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
