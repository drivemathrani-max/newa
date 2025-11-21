# Quick Start - User Article Management

## 🚀 Getting Started

### 1. Start the Server
```powershell
cd c:\Users\satee\OneDrive\Desktop\newa
npm start
```
✅ Server runs on http://localhost:3000

### 2. User Signup/Login Flow
1. Visit: http://localhost:3000/user-login.html
2. Click "Sign Up" at bottom
3. Enter:
   - Username: `testuser1`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign Up"
5. ✅ Automatically redirected to dashboard

### 3. Your Dashboard - user-articles.html
- Shows "No Articles Yet" initially
- Click "✍️ Write New Article" to create
- Submit article from add-news-user.html
- Article appears in dashboard

### 4. Manage Articles
**Edit:**
- Click "✏️ Edit" button
- Modal opens with article form
- Change title, category, description, or image
- Click "Save Changes"

**Delete:**
- Click "🗑️ Delete" button
- Confirm deletion
- Article removed from dashboard

**Search:**
- Type in search box to find by title
- Select category to filter

**Statistics:**
- Top cards show total and per-category counts
- Updates automatically as you edit/delete

### 5. Important Features
✅ **Privacy** - You only see YOUR articles  
✅ **Editing** - Modal form with validation  
✅ **Deletion** - Confirmation dialog  
✅ **Search** - Real-time filtering  
✅ **Theme** - Toggle dark/light mode  
✅ **Logout** - Clear session and return to login  

## 📂 Key Files

| File | Purpose |
|------|---------|
| `user-articles.html` | Your article dashboard |
| `user-articles.js` | Dashboard logic |
| `user-articles.css` | Dashboard styling |
| `add-news-user.html` | Create new article |
| `user-login.html` | Sign up / Login |
| `admin.html` | Admin panel (all articles) |
| `index.html` | Public news feed |

## 🔗 Quick Links

| Page | URL |
|------|-----|
| Dashboard | http://localhost:3000/user-articles.html |
| New Article | http://localhost:3000/add-news-user.html |
| Login/Signup | http://localhost:3000/user-login.html |
| News Feed | http://localhost:3000/index.html |
| Admin Panel | http://localhost:3000/admin.html |

## ✨ Features at a Glance

### Dashboard (user-articles.html)
```
┌─────────────────────────────────────┐
│ NewsHub | News | My Articles | Theme│
├─────────────────────────────────────┤
│ [Login Prompt or Stats Cards]        │
│ [Search Bar] [Category Filter]       │
├─────────────────────────────────────┤
│ [Article 1]    [Edit] [Delete]      │
│ [Article 2]    [Edit] [Delete]      │
│ [Article 3]    [Edit] [Delete]      │
└─────────────────────────────────────┘
```

### Edit Modal
```
┌──────────────────────────────────┐
│ ✏️ Edit Article          [✕]     │
├──────────────────────────────────┤
│ Title: [_________________]  0/200│
│ Category: [Select ▼]             │
│ Description: [__________]   0/2000│
│                                  │
│ Image URL: [_________________]   │
│ [Save Changes]    [Cancel]       │
└──────────────────────────────────┘
```

## 🧪 Quick Test

**Test User Isolation:**
1. Sign up as `user1`
2. Create article "User 1 Article"
3. Logout
4. Sign up as `user2`
5. ✅ Dashboard empty - User 2 has no articles
6. Create "User 2 Article"
7. Logout
8. Login as `user1`
9. ✅ See only "User 1 Article"

**Test Admin Access:**
1. Login to admin.html (password: `admin`)
2. ✅ See articles from ALL users

**Test Public Access:**
1. Visit index.html (public, no login needed)
2. ✅ See articles from ALL users

## 🎨 Customization

### Change Theme
- Click 🌙 (moon) or ☀️ (sun) button in header
- Theme persists after refresh

### Create Article
- Click "✍️ Write New Article"
- Go to add-news-user.html
- Fill form and submit
- Returns to dashboard

### Search Articles
- Type in search box - filters in real-time
- Select category from dropdown

### Statistics
- Top 4 cards show article counts
- Total + counts by category

## ⚠️ Troubleshooting

**"Please Login First"**
- Not logged in. Click "Login / Sign Up"
- Or use user-login.html

**No articles showing**
- You haven't created any yet
- Click "Write New Article"
- Go to add-news-user.html, fill form, submit

**Edit/Delete buttons not working**
- Check browser console (F12)
- Ensure server is running
- Try refreshing page

**Theme not saving**
- Check browser allows localStorage
- Disable browser extensions (can interfere)

## 📊 Your Data

**Stored where:**
- Articles: `news_data.json`
- Users: `users_data.json`
- Session: Browser sessionStorage
- Theme: Browser localStorage

**What's visible:**
- Only YOUR articles on dashboard
- ALL articles on public feed and admin
- Your username in menu

## 🔐 Security Notes

✅ Session-based login (not permanent)  
✅ Logout clears session  
✅ You can only edit/delete your articles  
✅ Admin can manage all articles  
✅ Public can only read  

## 🎯 Common Tasks

### Task: Submit a new article
1. Dashboard: Click "Write New Article"
2. Fill the form at add-news-user.html
3. Click "Submit Article"
4. Refresh dashboard to see it

### Task: Edit an article
1. Find article on dashboard
2. Click "Edit" button
3. Modify in modal
4. Click "Save Changes"

### Task: Delete an article
1. Find article on dashboard
2. Click "Delete" button
3. Confirm deletion
4. Article removed

### Task: Search your articles
1. Type title in search box
2. Results filter instantly
3. Clear search to see all

### Task: Filter by category
1. Select category from dropdown
2. Only that category displays
3. Select "All Categories" to reset

## 📝 Notes

- Existing articles before userId update use username filter
- Articles are private to user until published (all articles are published)
- Admin can edit/delete any article
- Public feed shows all articles
- Email notifications (if configured)

## 🆘 Need Help?

Check:
1. Server console for errors
2. Browser console (F12 → Console)
3. Network tab (F12 → Network) for failed requests
4. Testing guide: `USER_ARTICLE_TESTING.md`
5. Technical docs: `USER_ARTICLE_MANAGEMENT_COMPLETE.md`

---

**Everything is ready to use! Start with step 1: Start the Server** 🚀
