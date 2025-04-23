'use client'
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Link from 'next/link';

interface ActionAreaCardProps {

  title: string;

  description: string;

  image: string;

  link : string;

}

export default function ActionAreaCard({title, description, image, link}: ActionAreaCardProps) {


      
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link href={link} target="_blank">
        <CardActionArea>
          <CardContent >
            <Typography gutterBottom 
            variant="h5" 
            align='center' 
            component="div" 
            fontWeight="bold"
            sx={{  fontSize: '1.5rem' }}>
              {title}
            </Typography>
            <CardMedia
            component="img"
            height="140"
            image={image}
            alt="green iguana"
            sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}
          />
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              align='center'
              fontSize={'1.5rem'}>
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
