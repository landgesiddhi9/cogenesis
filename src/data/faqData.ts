export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  label: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    id: "ordering-payments",
    label: "Ordering & Payments",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept Visa, Mastercard, American Express, RuPay, UPI, Net Banking and Razorpay-supported payment methods.",
      },
      {
        question: "Is my payment secure?",
        answer:
          "Yes. All transactions are encrypted and processed securely through Razorpay.",
      },
      {
        question: "Can I place an order without creating an account?",
        answer: "Yes. Guest checkout is available.",
      },
      {
        question: "Can I modify my order after placing it?",
        answer: "Please contact us within 2 hours of placing your order.",
      },
    ],
  },
  {
    id: "shipping-delivery",
    label: "Shipping & Delivery",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "Orders are typically delivered within 3–7 business days across India.",
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes. Free shipping is available on all prepaid orders.",
      },
      {
        question: "How can I track my order?",
        answer: "Tracking information will be shared via email after dispatch.",
      },
      {
        question: "Do you ship internationally?",
        answer: "International shipping will be introduced soon.",
      },
    ],
  },
  {
    id: "returns-exchanges",
    label: "Returns & Exchanges",
    items: [
      {
        question: "What is your return policy?",
        answer: "Returns are accepted within 7 days of delivery.",
      },
      {
        question: "Can I exchange a product?",
        answer: "Yes, subject to stock availability.",
      },
      {
        question: "How long do refunds take?",
        answer: "Refunds are processed within 5–7 business days.",
      },
    ],
  },
  {
    id: "product-sizing",
    label: "Product & Sizing",
    items: [
      {
        question: "How do I choose the correct size?",
        answer:
          "Use our Size Guide available on every product page.",
      },
      {
        question: "Do your shirts fit true to size?",
        answer:
          "Yes. Our shirts follow standard contemporary tailoring measurements.",
      },
      {
        question: "Do your trousers come in multiple fits?",
        answer:
          "Yes. Selected styles are available in Tailored and Relaxed fits.",
      },
    ],
  },
  {
    id: "fabric-care",
    label: "Fabric Care",
    items: [
      {
        question: "How should I care for my garments?",
        answer:
          "Follow the care instructions provided on the garment label.",
      },
      {
        question: "Are your fabrics pre-shrunk?",
        answer:
          "Most fabrics undergo finishing processes to minimize shrinkage.",
      },
      {
        question: "Do linen garments wrinkle?",
        answer:
          "Natural linen may develop wrinkles as part of its character and elegance.",
      },
    ],
  },
  {
    id: "account-wishlist",
    label: "Account & Wishlist",
    items: [
      {
        question: "How do I create an account?",
        answer:
          "Click the Account icon in the navigation bar and register.",
      },
      {
        question: "Can I save items for later?",
        answer: "Yes. Add products to your Wishlist.",
      },
      {
        question: "Where can I view my orders?",
        answer: "Inside the Account Dashboard.",
      },
    ],
  },
  {
    id: "gift-cards",
    label: "Gift Cards",
    items: [
      {
        question: "Do you offer gift cards?",
        answer: "Yes. Digital gift cards are available.",
      },
      {
        question: "Do gift cards expire?",
        answer: "Gift cards remain valid for 12 months.",
      },
    ],
  },
  {
    id: "privacy-security",
    label: "Privacy & Security",
    items: [
      {
        question: "Is my personal information secure?",
        answer:
          "Yes. Customer information is protected using industry-standard security measures.",
      },
      {
        question: "Do you share customer data?",
        answer: "No. Customer information is never sold to third parties.",
      },
    ],
  },
  {
    id: "contact-us",
    label: "Contact Us",
    items: [
      {
        question: "How can I contact Cogenesis?",
        answer: "Email: Cogenesisadmin@gmail.com",
      },
      {
        question: "What are your support hours?",
        answer: "Monday – Saturday, 10:00 AM – 7:00 PM IST",
      },
      {
        question: "How quickly can I expect a response?",
        answer:
          "We aim to respond to all customer inquiries within 24 business hours.",
      },
    ],
  },
];

export default faqData;
