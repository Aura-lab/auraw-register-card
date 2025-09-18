# Register Card (React + TypeScript + Vite)

A one-page app that follows the **LO-FI assignment**.


## Features

**Navigation**

Burger icon opens a menu  
Back/overlay closes and returns to form  

<img width="695" height="546" alt="Screenshot 2025-09-18 at 10 40 01 PM" src="https://github.com/user-attachments/assets/b7595677-6d2f-417c-84c6-e0720a54d24d" />


**Inputs**
**Card number**: digits only (13–19)  
**CVC**: digits only (3–4)  
**Expiry**: `MM/YY` or `MM/YYYY`, not earlier than current month  

**Validation**

-Submit is disabled until all fields are valid  
-On submit, values are printed to the browser console  

## Getting Started

```bash
# install dependencies
npm install

# start dev server
npm run dev

# build for production
npm run build

# preview production build
npm run preview
