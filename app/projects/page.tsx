'use client'
import { useEffect, useState } from 'react';
import ActionAreaCard from '../../components/cards/customCard';
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

  useEffect(() => {
    fetch(`http://localhost:3000/api/projects/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }) // fetch the data from the API endpoint
    .then(response => { // handle if the response is not ok
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response;
    })
    .then((res) => res.json()) // convert the response to JSON
    .then((data) => setPro(data)) // set the data to the state variable
    .catch((error) => console.log("Error fetching data from the API: ", error)); // log any errors
  }, []);

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
                I am a software engineer and I . 
                I have worked on a variety of projects and I am always looking for new challenges. I am passionate about technology
              </h2>
          </div>
          <div className={style.container}>
              <div className={style.gridContainer}>
                  {
                        customCard
                }
              </div>
          </div>
      </>
  );
}
