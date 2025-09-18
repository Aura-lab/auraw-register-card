# Register Card (React + TypeScript + Vite)

A one-page app that follows the **LO-FI assignment**.


## Features

**Navigation**

Burger icon opens a menu  
Back/overlay closes and returns to form  

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
