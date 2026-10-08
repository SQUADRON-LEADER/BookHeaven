import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Server_URL } from "../utils/config";
import {
  INITIAL_BOOKS,
  INITIAL_MEMBERS,
  INITIAL_TRANSACTIONS,
  INITIAL_REGISTERED_ACCOUNTS,
} from "../data/mockData";

const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  // 1. Books State
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("academic_lib_books_v2");
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  // 2. Members State
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("academic_lib_members_v2");
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  // 3. Transactions State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("academic_lib_transactions_v2");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // 4. Registered Users Accounts State
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("academic_lib_accounts");
    return saved ? JSON.parse(saved) : INITIAL_REGISTERED_ACCOUNTS;
  });

  // 5. Current Logged-in User State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("academic_lib_auth_user");
    return saved ? JSON.parse(saved) : INITIAL_REGISTERED_ACCOUNTS[0]; // Admin by default
  });

  // 6. Notification Banner State
  const [notification, setNotification] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem("academic_lib_books_v2", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("academic_lib_members_v2", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("academic_lib_transactions_v2", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("academic_lib_accounts", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("academic_lib_auth_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("academic_lib_auth_user");
    }
  }, [currentUser]);

  // Flash Notification System
  const showNotification = (message, type = "success") => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  const clearNotification = () => setNotification(null);

  // ----------------------------------------------------
  // Real User Authentication & Registration
  // ----------------------------------------------------
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try backend server if reachable
    try {
      const res = await axios.post(`${Server_URL}users/login`, {
        email: cleanEmail,
        password,
      });
      if (res.data?.token) {
        const userObj = res.data.user || {
          email: cleanEmail,
          name: cleanEmail.split("@")[0],
          role: res.data.role || "student",
        };
        localStorage.setItem("authToken", res.data.token);
        setCurrentUser(userObj);
        showNotification(`Login successfully! Welcome, ${userObj.name}.`, "success");
        return { success: true, user: userObj };
      }
    } catch (err) {
      // Backend may be offline or returned invalid credentials; check local registered accounts
    }

    // 2. Validate against local persistent registered accounts
    const foundUser = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail &&
        u.password === password
    );

    if (foundUser) {
      const authUser = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        department: foundUser.department || "Academic Dept",
      };
      setCurrentUser(authUser);
      showNotification(`Login successfully! Welcome back, ${foundUser.name} (${foundUser.role.toUpperCase()}).`, "success");
      return { success: true, user: authUser };
    } else {
      showNotification("Invalid email address or password. Please verify your institutional credentials.", "danger");
      return { success: false, message: "Invalid email address or password." };
    }
  };

  const registerUser = async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();

    // Check duplicate email
    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      showNotification(`Account Registration Failed: Email "${cleanEmail}" is already registered.`, "danger");
      return { success: false, message: `Email "${cleanEmail}" is already in use.` };
    }

    const newUser = {
      id: `USR-${String(registeredUsers.length + 1).padStart(3, "0")}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      role: userData.role || "student",
      department: userData.department || "General Studies",
    };

    setRegisteredUsers([...registeredUsers, newUser]);

    // Also auto-add as a library member if student or faculty
    const isMember = members.some((m) => m.email.toLowerCase() === cleanEmail);
    if (!isMember && (newUser.role === "student" || newUser.role === "faculty")) {
      const newMember = {
        id: `MEM-${100 + members.length + 1}`,
        name: newUser.name,
        email: newUser.email,
        phone: userData.phone || "",
        department: newUser.department,
        role: newUser.role === "faculty" ? "Faculty" : "Student",
        maxLimit: newUser.role === "faculty" ? 6 : 3,
        status: "Active",
        joinDate: new Date().toISOString().split("T")[0],
      };
      setMembers((prev) => [...prev, newMember]);
    }

    // Attempt registration on backend too (non-blocking)
    try {
      await axios.post(`${Server_URL}users/register`, {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        stream: newUser.department,
        year: 1,
      });
    } catch (e) {
      // Ignored if offline
    }

    showNotification(`Account created successfully for ${newUser.name}. You may now sign in.`, "success");
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    showNotification("You have been signed out from the library portal.", "info");
  };

  const switchRole = (newRole) => {
    const found = registeredUsers.find((u) => u.role === newRole) || {
      id: `USR-TEMP`,
      name: `${newRole.charAt(0).toUpperCase() + newRole.slice(1)} User`,
      email: `${newRole}@library.edu`,
      role: newRole,
      department: "Library Administration",
    };

    setCurrentUser({
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      department: found.department || "General",
    });
    showNotification(`Active role switched to: ${newRole.toUpperCase()}`, "info");
  };

  // ----------------------------------------------------
  // Book Management (Test Cases 3, 4, 5, 11)
  // ----------------------------------------------------
  const addBook = (bookData) => {
    const cleanIsbn = (bookData.isbn || "").trim();

    // Test Case 4: Duplicate ISBN validation
    const duplicate = books.find(
      (b) => b.isbn.replace(/-/g, "").toLowerCase() === cleanIsbn.replace(/-/g, "").toLowerCase()
    );

    if (duplicate) {
      showNotification(
        `Duplicate ISBN Error: ISBN "${cleanIsbn}" is already registered to "${duplicate.title}".`,
        "danger"
      );
      return {
        success: false,
        errorField: "isbn",
        message: `Duplicate ISBN: ${cleanIsbn} already belongs to "${duplicate.title}".`,
      };
    }

    const total = parseInt(bookData.totalCopies, 10) || 1;
    const newBook = {
      id: `BK-${1000 + books.length + 1}`,
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      isbn: cleanIsbn,
      category: bookData.category || "General",
      year: parseInt(bookData.year, 10) || new Date().getFullYear(),
      publisher: bookData.publisher || "Academic Press",
      totalCopies: total,
      availableCopies: total,
      shelfLocation: bookData.shelfLocation || "General Stacks",
      callNumber: bookData.callNumber || `LIB.${Math.floor(100 + Math.random() * 900)}`,
      price: parseFloat(bookData.price) || 0,
    };

    setBooks([newBook, ...books]);
    showNotification(`Book "${newBook.title}" successfully added to library catalog.`, "success");
    return { success: true, book: newBook };
  };

  const editBook = (id, updatedData) => {
    const cleanIsbn = (updatedData.isbn || "").trim();

    // Check duplicate ISBN on other books
    const duplicate = books.find(
      (b) =>
        b.id !== id &&
        b.isbn.replace(/-/g, "").toLowerCase() === cleanIsbn.replace(/-/g, "").toLowerCase()
    );

    if (duplicate) {
      showNotification(
        `Duplicate ISBN Error: ISBN "${cleanIsbn}" is already assigned to "${duplicate.title}".`,
        "danger"
      );
      return {
        success: false,
        errorField: "isbn",
        message: `Duplicate ISBN: ${cleanIsbn} already belongs to "${duplicate.title}".`,
      };
    }

    const targetBook = books.find((b) => b.id === id);
    if (!targetBook) return { success: false, message: "Book not found." };

    const newTotal = parseInt(updatedData.totalCopies, 10) || targetBook.totalCopies;
    const currentlyIssued = targetBook.totalCopies - targetBook.availableCopies;
    const newAvailable = Math.max(0, newTotal - currentlyIssued);

    const updated = books.map((b) =>
      b.id === id
        ? {
            ...b,
            ...updatedData,
            isbn: cleanIsbn,
            totalCopies: newTotal,
            availableCopies: newAvailable,
          }
        : b
    );

    setBooks(updated);
    showNotification(`Book record updated for "${updatedData.title || targetBook.title}".`, "success");
    return { success: true };
  };

  // Test Case 11: Unauthorized book deletion
  const deleteBook = (id) => {
    if (!currentUser || currentUser.role !== "admin") {
      showNotification(
        "Unauthorized Action: Only Library Administrators have permission to delete catalog records.",
        "danger"
      );
      return {
        success: false,
        unauthorized: true,
        message: "Unauthorized: Only administrators have permission to delete books.",
      };
    }

    const targetBook = books.find((b) => b.id === id);
    if (!targetBook) return { success: false, message: "Book not found." };

    const hasActiveBorrow = transactions.some(
      (t) => t.bookId === id && t.status === "Issued"
    );

    if (hasActiveBorrow) {
      showNotification(
        `Cannot delete "${targetBook.title}": Copies are currently issued to patrons.`,
        "danger"
      );
      return {
        success: false,
        message: "Cannot delete book while copies are currently issued to members.",
      };
    }

    setBooks(books.filter((b) => b.id !== id));
    showNotification(`Book "${targetBook.title}" removed from catalog.`, "success");
    return { success: true };
  };

  // ----------------------------------------------------
  // Member Management (Test Case 6)
  // ----------------------------------------------------
  const addMember = (memberData) => {
    const cleanId = (memberData.id || "").trim().toUpperCase();

    // Test Case 6: Duplicate Member ID validation
    const duplicateId = members.find(
      (m) => m.id.toUpperCase() === cleanId
    );

    if (duplicateId) {
      showNotification(
        `Duplicate ID Error: Member ID "${cleanId}" is already assigned to ${duplicateId.name}.`,
        "danger"
      );
      return {
        success: false,
        errorField: "id",
        message: `Duplicate Member ID: "${cleanId}" is already registered to ${duplicateId.name}.`,
      };
    }

    const newMember = {
      id: cleanId || `MEM-${100 + members.length + 1}`,
      name: memberData.name.trim(),
      email: memberData.email.trim(),
      phone: memberData.phone ? memberData.phone.trim() : "",
      department: memberData.department || "General",
      role: memberData.role || "Student",
      maxLimit: parseInt(memberData.maxLimit, 10) || 3,
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
    };

    setMembers([newMember, ...members]);
    showNotification(`Member "${newMember.name}" (${newMember.id}) registered successfully.`, "success");
    return { success: true, member: newMember };
  };

  const editMember = (id, updatedData) => {
    const updated = members.map((m) =>
      m.id === id ? { ...m, ...updatedData } : m
    );
    setMembers(updated);
    showNotification(`Member profile updated for ${id}.`, "success");
    return { success: true };
  };

  const deleteMember = (id) => {
    if (!currentUser || currentUser.role !== "admin") {
      showNotification("Unauthorized: Only administrators can delete member records.", "danger");
      return { success: false, message: "Unauthorized action." };
    }

    const hasActiveBorrow = transactions.some(
      (t) => t.memberId === id && t.status === "Issued"
    );

    if (hasActiveBorrow) {
      showNotification("Cannot delete member with unreturned book loans.", "danger");
      return { success: false, message: "Member has active book loans." };
    }

    setMembers(members.filter((m) => m.id !== id));
    showNotification(`Member record ${id} removed from system.`, "success");
    return { success: true };
  };

  // ----------------------------------------------------
  // Fine Calculation (Test Case 10)
  // ----------------------------------------------------
  const calculateFine = (dueDateString, finePerDay = 5) => {
    if (!dueDateString) return { daysOverdue: 0, fine: 0, isOverdue: false };
    const dueDate = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = today - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        daysOverdue: diffDays,
        fine: diffDays * finePerDay,
        isOverdue: true,
      };
    }
    return { daysOverdue: 0, fine: 0, isOverdue: false };
  };

  // ----------------------------------------------------
  // Issue & Return Operations (Test Cases 7, 8, 9, 10, 12)
  // ----------------------------------------------------
  const issueBook = ({ memberId, bookId, days = 14 }) => {
    const book = books.find((b) => b.id === bookId);
    const member = members.find((m) => m.id === memberId);

    if (!book) {
      showNotification("Error: Book title not found in catalog.", "danger");
      return { success: false, message: "Book not found." };
    }
    if (!member) {
      showNotification("Error: Member not found in directory.", "danger");
      return { success: false, message: "Member not found." };
    }

    // Test Case 8 & 12: Stock availability check
    if (book.availableCopies <= 0) {
      showNotification(
        `Issue Blocked: "${book.title}" is out of stock (0 copies available in stacks).`,
        "danger"
      );
      return {
        success: false,
        message: `Book "${book.title}" has 0 available copies. All copies are currently issued.`,
      };
    }

    // Check Member Borrowing Limit
    const activeBorrowsCount = transactions.filter(
      (t) => t.memberId === memberId && t.status === "Issued"
    ).length;

    if (activeBorrowsCount >= member.maxLimit) {
      showNotification(
        `Borrowing Limit Reached: ${member.name} already holds ${activeBorrowsCount}/${member.maxLimit} active books.`,
        "danger"
      );
      return {
        success: false,
        message: `Member ${member.name} has reached maximum borrowing limit of ${member.maxLimit} books.`,
      };
    }

    // Calculate dates
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + parseInt(days, 10));

    const issueDateStr = today.toISOString().split("T")[0];
    const dueDateStr = dueDate.toISOString().split("T")[0];

    const newTransaction = {
      id: `TXN-${800 + transactions.length + 1}`,
      bookId: book.id,
      bookTitle: book.title,
      isbn: book.isbn,
      memberId: member.id,
      memberName: member.name,
      issueDate: issueDateStr,
      dueDate: dueDateStr,
      returnDate: null,
      status: "Issued",
      finePerDay: 5,
    };

    // Decrement available copies
    const updatedBooks = books.map((b) =>
      b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b
    );

    setBooks(updatedBooks);
    setTransactions([newTransaction, ...transactions]);

    showNotification(
      `Book "${book.title}" issued to ${member.name} (Due Date: ${dueDateStr}).`,
      "success"
    );
    return { success: true, transaction: newTransaction };
  };

  const returnBook = (transactionId, options = { waiveFine: false, notes: "" }) => {
    const txn = transactions.find((t) => t.id === transactionId);
    if (!txn || txn.status === "Returned") {
      showNotification("Transaction record already returned or invalid.", "danger");
      return { success: false, message: "Invalid transaction." };
    }

    const { daysOverdue, fine } = calculateFine(txn.dueDate, txn.finePerDay || 5);
    const finalFine = options.waiveFine ? 0 : fine;
    const todayStr = new Date().toISOString().split("T")[0];

    // Increment available copies back
    const updatedBooks = books.map((b) =>
      b.id === txn.bookId
        ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) }
        : b
    );

    const updatedTransactions = transactions.map((t) =>
      t.id === transactionId
        ? {
            ...t,
            returnDate: todayStr,
            status: "Returned",
            finePaid: finalFine,
            daysOverdue: daysOverdue,
            notes: options.notes || (options.waiveFine ? "Fine Waived" : ""),
          }
        : t
    );

    setBooks(updatedBooks);
    setTransactions(updatedTransactions);

    if (daysOverdue > 0 && !options.waiveFine) {
      showNotification(
        `Book "${txn.bookTitle}" returned with ₹${finalFine} overdue fine (${daysOverdue} days overdue).`,
        "success"
      );
    } else {
      showNotification(`Book "${txn.bookTitle}" successfully returned & restored to stock.`, "success");
    }

    return { success: true, fine: finalFine, daysOverdue };
  };

  // Reset to initial clean seed data
  const resetToSampleData = () => {
    setBooks(INITIAL_BOOKS);
    setMembers(INITIAL_MEMBERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setRegisteredUsers(INITIAL_REGISTERED_ACCOUNTS);
    showNotification("Library dataset restored to initial comprehensive seed state.", "info");
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        members,
        transactions,
        registeredUsers,
        currentUser,
        notification,
        showNotification,
        clearNotification,
        login,
        registerUser,
        logout,
        switchRole,
        addBook,
        editBook,
        deleteBook,
        addMember,
        editMember,
        deleteMember,
        issueBook,
        returnBook,
        calculateFine,
        resetToSampleData,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}
