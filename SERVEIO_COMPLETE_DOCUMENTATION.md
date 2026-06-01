# SERVEIO VIDEO RECORDING SCRIPT
## Complete Architecture Demonstration

**Total Duration: 15-20 minutes**

---

## INTRODUCTION (1 minute)

**Script to Say:**
```
"Hello everyone, I'm going to walk you through the Serveio 
restaurant ordering application. 

Serveio is built with modern microservices architecture. 
It has 6 independent services that work together to create 
a complete ordering system.

In this video, I'll show you:
- How the application works from a user perspective
- The architecture behind the scenes
- All 6 services and their purposes
- How services communicate with each other

Let's get started."
```

**Visual: Show title slide or application home screen**

---

## OPENING & USER LOGIN (2 minutes)

**Script to Say:**
```
"First, let's open the application. The frontend runs on 
localhost:5173. This is the React application that users 
see and interact with.

Let me open it in the browser."
```

**ACTION: Open browser and go to http://localhost:5173**

**What you should see on screen:**
- Login page
- Email and password fields
- Register and Login buttons

**Script to Say:**
```
"Here's the login page. When users visit the app for the 
first time, they need to create an account.

Let me register a new user. I'll fill in:
- Email: demo@example.com
- Password: demo123
- Name: Demo User
"
```

**ACTION: Fill in registration form and click Register**

**Wait for success message**

**Script to Say:**
```
"Great! The user account is created and we're automatically 
logged in. This login process uses the USERS SERVICE running 
on port 3000.

Here's what happened behind the scenes:
1. Frontend sent email and password to Users Service
2. Users Service validated the credentials
3. Generated a JWT token (like a digital ID)
4. Sent token back to frontend
5. Frontend stored the token
6. Now we're logged in and can access other features

Let's continue to the menu page."
```

---

## BROWSING MENUS (2 minutes)

**Script to Say:**
```
"Now we're on the menu page. This shows all available menus 
and food items. This data comes from the RESTAURANT SERVICE 
running on port 3001.

When the page loaded, the frontend sent a request to the 
Restaurant Service asking for all menus and items. 
The service retrieved this from its database and sent it back."
```

**ACTION: Show the menu page with different menus/categories**

**Scroll and point to different items**

**Script to Say:**
```
"Here we can see:
- Different menu categories
- Food items with names and prices
- Add to cart buttons

Let me add a few items to the cart to show you how that works."
```

---

## ADDING ITEMS TO CART (2 minutes)

**Script to Say:**
```
"When I click 'Add to Cart', this sends a request to the 
CART SERVICE running on port 3002.

The Cart Service:
1. Receives the item details from frontend
2. Receives the JWT token so it knows which user this is
3. Adds the item to that user's cart
4. Updates the cart total

Let me add several items."
```

**ACTION: Click "Add to Cart" on 3-4 items**

**Watch cart count increase on screen**

**Script to Say:**
```
"Notice how the cart count in the top right is updating. 
It now shows 4 items. Each time I add something, the Cart 
Service processes it and updates the total.

Let me click on the cart to see the full summary."
```

---

## VIEWING THE SHOPPING CART (2 minutes)

**Script to Say:**
```
"Here's the shopping cart. We can see:
- All items we added
- Quantity of each item
- Individual prices
- Subtotal at the bottom
- Tax calculation
- Final total

The Cart Service calculated:
- Subtotal: $XX.XX (all items multiplied by quantity)
- Tax: $XX.XX (subtotal × 8%)
- Total: $XX.XX (subtotal + tax)

I can update quantities or remove items if I want. 
The Cart Service recalculates everything automatically.

Now let's proceed to checkout."
```

**ACTION: Click Checkout button**

---

## PLACING AN ORDER (2 minutes)

**Script to Say:**
```
"Now we're at the checkout page. This is where the ORDER 
SERVICE comes into play (running on port 3003).

When I click 'Place Order', here's what happens:
1. Frontend sends all cart items to the Order Service
2. Order Service validates the items exist and prices match
3. Order Service creates an order record in its database
4. Assigns a unique Order ID
5. Sets the status to PENDING
6. Triggers the NOTIFICATION SERVICE
7. Notification Service sends email/SMS/push to customer

Let me place the order."
```

**ACTION: Click "Place Order" button**

**Wait for confirmation**

**Script to Say:**
```
"Perfect! Order created successfully. Look at the Order ID: 
[Show the ID]. This is the unique identifier for this order.

The order is now in the Order Service database with:
- All items ordered
- Total price: $XX.XX
- Status: PENDING
- Timestamp: [Show time]
- User information

At the same time, the Notification Service sent:
- Confirmation email
- SMS notification (if phone number provided)
- Push notification (if mobile app)

Let me show you the Orders page where we can track this."
```

---

## TRACKING YOUR ORDER (2 minutes)

**Script to Say:**
```
"Now let's go to the Orders page. This shows all orders for 
the logged-in user.

The frontend requested this data from the ORDER SERVICE by 
sending:
1. A request to get all orders
2. The JWT token so the service knows which user we are

The Order Service looked up the database and returned all 
orders for this user."
```

**ACTION: Click on Orders in navigation**

**Show list of orders**

**Script to Say:**
```
"Here we can see:
- Order ID: [Show]
- Items in each order
- Total amount paid
- Current status: PENDING
- When the order was placed

Let me click on this order to see more details."
```

**ACTION: Click on the latest order**

**Script to Say:**
```
"Here's the detailed view of the order:
- Each item with quantity and price
- Order breakdown
- Total cost
- Status timeline

An admin or restaurant staff can update the status. 
For example, they might change:
- PENDING → PREPARING (kitchen started making food)
- PREPARING → READY (order is ready for pickup)
- READY → DELIVERED (given to customer)

Each status change triggers the NOTIFICATION SERVICE 
to alert the customer automatically."
```

---

## EXPLAINING THE ARCHITECTURE (3-4 minutes)

**Script to Say:**
```
"Now let me explain the architecture behind what we just saw.

Serveio uses a MICROSERVICES architecture. This means 
instead of one big application, we have 6 independent services, 
each doing one job well.

Let me break down each service:"
```

**ACTION: Open a text editor or presentation with the architecture diagram**

### **SERVICE 1: USERS SERVICE (Port 3000)**

**Script to Say:**
```
"The USERS SERVICE handles:
- User registration
- User login and authentication
- Profile management
- JWT token generation

When we registered and logged in, this service processed it.
It issued a JWT token that we used for all other requests.
All other services verify this token to make sure requests 
are from authenticated users."
```

### **SERVICE 2: RESTAURANT SERVICE (Port 3001)**

**Script to Say:**
```
"The RESTAURANT SERVICE manages:
- Menus and their organization
- Food items and details
- Categories
- Pricing

When we browsed menus, this service provided that data.
Restaurant admins use this service to add or update menu items."
```

### **SERVICE 3: CART SERVICE (Port 3002)**

**Script to Say:**
```
"The CART SERVICE handles:
- Adding items to cart
- Updating quantities
- Removing items
- Calculating totals including tax

This service keeps track of what each user has in their cart.
It uses the JWT token to know which user owns the cart."
```

### **SERVICE 4: ORDER SERVICE (Port 3003)**

**Script to Say:**
```
"The ORDER SERVICE manages:
- Creating orders from cart items
- Storing order history
- Tracking order status
- Providing order details

When we placed an order, this service created the record.
It's also what we queried when viewing our orders."
```

### **SERVICE 5: NOTIFICATION SERVICE (Port 3004)**

**Script to Say:**
```
"The NOTIFICATION SERVICE sends:
- Email confirmations
- SMS messages
- Push notifications

When an order is placed or status changes, this service 
automatically notifies the customer."
```

### **SERVICE 6: FRONTEND (React on Port 5173)**

**Script to Say:**
```
"The FRONTEND is the user interface built with React.
It communicates with all services using REST APIs.
It stores the JWT token and includes it in all requests.
It handles caching so repeated requests don't need new API calls."
```

---

## HOW SERVICES WORK TOGETHER (2 minutes)

**Script to Say:**
```
"Let me show you how all these services work together.

When a user places an order, here's the complete flow:

1. User clicks Place Order on Frontend
2. Frontend collects items from Cart Service
3. Frontend sends order to Order Service with JWT token
4. Order Service validates items and creates order
5. Order Service triggers Notification Service
6. Notification Service sends email/SMS/push
7. Frontend clears the cart
8. User sees order confirmation

All services communicate through REST APIs.
Each service has its own database.
If one service fails, others keep working.
This is called LOOSE COUPLING."
```

**ACTION: Point to or draw the flow visually**

---

## SECURITY & JWT TOKENS (1 minute)

**Script to Say:**
```
"Security is important. We use JWT tokens for this.

Here's how it works:
1. Users Service generates a token when user logs in
2. Token contains user ID and information
3. Token is signed with a secret key
4. All other services verify the token using that secret key
5. If token is invalid or expired, request is rejected

This ensures:
- Only authenticated users can access services
- Users can only see their own data
- Tokens can't be forged"
```

---

## HOW TO RUN LOCALLY (1 minute)

**Script to Say:**
```
"To run this application locally, we use Docker.

In the root directory, we run: docker compose up

This starts all 6 services and their databases automatically.

Then in the frontend folder, we run: npm run dev

This starts the React development server on localhost:5173.

All services communicate with each other on localhost.
This setup makes it easy for developers to test locally
before deploying to production."
```

---

## SUMMARY & CONCLUSION (1 minute)

**Script to Say:**
```
"In summary, Serveio is a modern restaurant ordering platform built with:

✓ Microservices architecture - 6 independent services
✓ REST APIs - Services communicate through APIs
✓ JWT authentication - Secure requests
✓ PostgreSQL databases - Reliable data storage
✓ Docker containerization - Consistent environment
✓ React frontend - Professional user interface

Benefits of this architecture:
✓ Easy to scale individual services
✓ Services can be updated independently
✓ If one service fails, others continue
✓ Clear separation of concerns
✓ Professional and maintainable code

Thank you for watching. Do you have any questions?"
```

---

## RECORDING CHECKLIST

Before recording, make sure:

- [ ] All services are running (`docker compose up`)
- [ ] Frontend is running (`npm run dev`)
- [ ] Browser is at http://localhost:5173
- [ ] Your terminal shows no errors
- [ ] Screen resolution is good for recording
- [ ] Microphone is working
- [ ] Have a test account credentials ready
- [ ] Recording software is open (OBS, Zoom, etc.)

---

## TIMING BREAKDOWN

| Section | Duration |
|---------|----------|
| Introduction | 1 min |
| Login/Register | 2 min |
| Browse Menus | 2 min |
| Add to Cart | 2 min |
| View Cart | 2 min |
| Place Order | 2 min |
| Track Order | 2 min |
| Architecture Explanation | 4 min |
| Data Flow | 2 min |
| Security | 1 min |
| Local Development | 1 min |
| Summary | 1 min |
| **TOTAL** | **~22 minutes** |

---

**Ready to record! Just follow this script while showing the application on screen. Good luck! 🎥**
