import React, { useRef } from 'react'
import styles from './sidebar.module.css'
import emailjs from '@emailjs/browser';
import Link from 'next/link';
import Image from 'next/image';


export default function ContactMe() {
  const form = useRef<HTMLFormElement>(null);

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

  return (
    <>

        <Link href="https://www.linkedin.com/in/yan-chen-8a7a50211" target='blank' className={styles.linkedin}>
          <Image  
                    className={styles.logo}
                    width={90}
                    height={90}
                    src="/linkedin.svg" alt="Linkedin" />
        </Link>

        <Link href="https://github.com/Sparerow1" target='blank' className={styles.github}>
          <Image  
                    className={styles.logo}
                    width={90}
                    height={90}
                    src="/github.svg" alt="Github" />
        </Link>

      <h1 className={styles.title}>Contact Me</h1>
      <fieldset className={styles.fieldset}>
        <form ref={form} onSubmit={sendEmail}>
          <label className={styles.label}> 
            Name: *
            <input type="text" className={styles.input} name="from_name"/>

            Email: *
            <input type="email" className={styles.input} name='email_address'/>

            LinkedIn(if you want to):
            <input type="text" className={styles.input} name='linkedin'/>

            Message: *
            <textarea className={styles.message} name='message'/>
          </label>
          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      </fieldset>
    </>
  )
}

