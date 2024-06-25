# Jojo-Pixels

Capture the moment!!

Unleash your creativity and capture life's beauty with Jojo-Pixels, a dynamic photography portfolio platform designed for photographers to showcase their finest work. Whether you're an amateur enthusiast or a seasoned professional, Jojo-Pixels invites you to share your stunning photographs along with captivating captions, allowing you to connect deeply with your audience.

## Features

- **Showcase Your Vision:** Display your photographic talents and artistic perspective through a beautifully curated portfolio.
- **Interactive Engagement:** Engage with your audience through likes and comments, fostering a community of appreciation and inspiration.
- **Professional Exposure:** Utilize Jojo-Pixels to highlight your portfolio for potential business collaborations and career opportunities.
- **High-Quality Uploads:** Upload high-resolution images up to 10 MB in size, ensuring your photos are displayed in their full glory.

## Platform Benefits

Jojo-Pixels not only celebrates your creativity but also serves as a robust platform for networking and professional growth. Whether you're looking to attract clients, collaborate on projects, or simply share your passion for photography, Jojo-Pixels provides the tools and visibility you need to thrive in the digital landscape.

## Project Structure

This repository contains the code for the Jojo-Pixels project.

- `my-app`: Contains the project folders and files.

## Prerequisites

- Node.js
- Next.js
- Clerk
- Uploadthing
- MongoDB
- Visual Studio Code or any preferred code editor

## Getting Started

### Backend Setup

1. **Clone the repository:**

   Open an empty folder where you want to clone the repository

   ```sh
   git clone https://github.com/yourusername/Jojo-Pixels.git
   cd Jojo-Pixels
   cd my-app

2. **Install dependencies:**

   ```sh
   npm install

3. **Set up environment variables:**

   Create a .env.local file inside the "my-app" folder with the following keys:
   
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   MONGODB_URL=your_mongodb_connection_string_here
   UPLOADTHING_SECRET=your_uploadthing_secret_here
   UPLOADTHING_APP_ID=your_uploadthing_app_id_here
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_next_public_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here

   Obtain these values from:-
   - MongoDB Atlas for MONGODB_URL
   - Clerk for NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
   - UploadThing for UPLOADTHING_SECRET and UPLOADTHING_APP_ID

4. **Start the app:**

   ```sh
   npm run dev

## Key Points

### Environment Variables:
Ensure you have set up the necessary environment variables in the `.env.local` file for the backend.

### External Services:
Visit [Clerk](https://clerk.com/) and [UploadThing](https://uploadthing.com/) to obtain the required keys for authentication and image uploading.

### MongoDB:
Make sure to replace `your_mongodb_connection_string_here` with your actual MongoDB connection string.

## License
This project is licensed under the MIT License.
