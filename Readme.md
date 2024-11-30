<div align="center">
  <br />
    <a href="www.linkedin.com/in/rifatul-islam-757b062a6" target="_blank">
      <img src="https://iili.io/20YLVTl.md.png" alt="Project Banner">
    
  <br />

  <div>
    <img src="https://iili.io/20YZxbR.md.png" alt="React"  width="10px" height="10px"/>

    
   
 <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
 <img src="https://iili.io/20YtWjR.png"  width="10px" height="10px"/>
  </div>

  <h3 align="center">Social Media App</h3>

   <div align="center">
    Welcome to our Social Media App! 🌐 This powerful, feature-rich social media platform allows users to connect, communicate, and share moments in real-time. Inspired by Facebook's extensive functionality, this app leverages a modern tech stack to deliver a seamless, engaging, and responsive user experience.
    </div>
</div>


# 🌐 SocialSphere - Your World, Connected! 🌟

Welcome to **SocialSphere**, the ultimate social media platform where connectivity meets creativity. Inspired by the features you love and reimagined for seamless performance across devices, **SocialSphere** is your digital home for communication, entertainment, and everything in between! 🎉

## ✨ Features That Make Us Shine

### 🚀 **Core Features**
- 👫 **Connect with Friends**: Send friend requests, build connections, and stay in touch.
- 💬 **Real-Time Messaging**: Chat with your friends instantly using smooth and fast messaging.
- 📢 **News Feed**: Scroll through a dynamic feed of posts, updates, and multimedia.
- ❤️ **Reactions and Comments**: Like, love, or react with emojis, and leave comments on posts.
- 📸 **Photo & Video Sharing**: Share your favorite moments with high-quality images and videos.
- 📍 **Stories**: Post 24-hour stories to share your day in bite-sized moments.

### 📱 **Responsive Design**
- 🖥️ **Desktop-Ready**: Enjoy the full experience on your PC or laptop.
- 📱 **Mobile-Friendly**: Perfectly optimized for your smartphone.
- 📟 **Tablet Support**: A smooth interface for all your tablet needs.
- 🔄 **Seamless Transitions**: Consistent look and feel across all devices.

### 🌟 **Advanced Features**
- 🎥 **Live Streaming**: Go live and engage with your audience in real time.
- 🛒 **Marketplace**: Buy, sell, or discover products through our intuitive marketplace.
- 🏆 **Gamified Rewards**: Earn badges and rewards for your engagement and achievements.
- 🧠 **AI-Driven Recommendations**: Get personalized content based on your preferences.
- 🔒 **Privacy Controls**: Robust tools to control who sees your content.
- 🎨 **Customizable Themes**: Choose your own theme to make SocialSphere uniquely yours.
- 🔔 **Smart Notifications**: Stay updated without getting overwhelmed.

### 🌍 **Global Connectivity**
- 🌐 **Multilingual Support**: Available in multiple languages for a truly global community.
- 🌟 **Localized Trends**: Discover what’s trending near you or across the globe.

### ⚡ **Performance & Accessibility**
- 🚀 **Blazing Fast Load Times**: Built for speed and efficiency, even on slower connections.
- 🧩 **Progressive Web App (PWA)**: Access SocialSphere without needing to download an app.
- 👓 **Accessibility First**: Designed to be inclusive and usable for everyone.

### 🔄 **Real-Time Interactions**
- 👥 **Group Chats**: Engage in group conversations with friends or communities.
- 🗨️ **Community Groups**: Join or create groups based on your interests.
- 🎯 **Polls and Events**: Create polls or events to gather opinions and organize meetups.

### 🔐 **Security**
- 🔒 **End-to-End Encryption**: Your chats and data are always secure.
- 🛡️ **Two-Factor Authentication**: Extra layers of security for your account.
- 🕵️ **Anti-Fraud Measures**: Advanced algorithms to detect and prevent misuse.

### 🎭 **Personalization**
- ✏️ **Custom Profiles**: Add a bio, profile picture, and cover photo.
- 🖼️ **Album Organization**: Keep your photos neatly organized in albums.
- 🗂️ **Saved Posts**: Bookmark posts to revisit them anytime.

---

## 📥 Installation & Setup
``cd backend``
``cd frontend``

```bash
npm install
npm run dev
```
# 📁Backend

all the end point in the routes folder
all the logic in controls folder
entry point ``index.ts``
all the Schema in models folder

# some types

```javascript
type friend = {
    FriendId:{
        _id:string
        name:string
        profilePicture:string

    },
    _id:string
   
}[]


type message = {
    sender:{
        _id:string,
        name:string,
        profilePicture:string
    };
    receiver:string;
    Message: string;
    createdAt: Date;
    sendTime: Date;
    _id:string
}

type Card = {
    LikeCount:number,
    commentCount:number,
      postId:{
        _id:string,
        createdAt:string,
        mediaUrl?:string,
        textContent?:string,
        userId?:{
          name:string,
          profilePicture:string | null,
          _id:string
        }
  
  
      },
    _id:string
  
  };

  type people= {
    name: string;
    _id:string
    profilePicture: string;
  }[]

  type Data = {
    FriendId:{
        name:string,
    profilePicture:string,
    _id:string

    }
    
    createdAt:Date,
    _id:string
}[]

type Card = {
    LikeCount:number,
    commentCount:number,
      postId:{
        _id:string,
        createdAt:string,
        mediaUrl?:string,
        textContent?:string,
        userId?:{
          name:string,
          profilePicture:string | null,
          _id:string
        }
  
  
      },
    _id:string
  
  }


  type data = {
    _id:string,
    userId:{
      name:string,
      _id:string,
      profilePicture:string
    },
    createdAt:string
  }

  type Card = {
    LikeCount:number,
    commentCount:number,
      postId:{
        _id:string,
        createdAt:string,
        mediaUrl?:string,
        textContent?:string,
        userId?:{
          name:string,
          profilePicture:string | null,
          _id:string
        }
  
  
      },
    _id:string
  
  }[];

  type Card = {
    LikeCount:number,
    commentCount:number,
      postId:{
        _id:string,
        createdAt:string,
        mediaUrl?:string,
        textContent?:string,
        userId?:{
          name:string,
          profilePicture:string | null,
          _id:string
        }
  
  
      },
    _id:string
  
  }
```



