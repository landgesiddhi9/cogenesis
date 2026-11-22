export interface FAQItem {
  question: string;
  answer?: string;
  answerHtml?: string;
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
        answerHtml: `
          <p>We accept a wide range of secure online payment methods for your convenience, including:</p>
          <ul>
            <li><strong>Credit &amp; Debit Cards:</strong> Visa, Mastercard, RuPay and other supported card networks.</li>
            <li><strong>UPI:</strong> Google Pay, PhonePe, BHIM and other supported UPI applications.</li>
            <li><strong>Net Banking:</strong> Payments through supported banks.</li>
            <li><strong>Digital Wallets:</strong> Available supported wallet options.</li>
            <li><strong>EMI:</strong> Eligible credit and debit card EMI options, where available.</li>
          </ul>
          <p>Available payment methods will be displayed at checkout.</p>
        `,
      },
      {
        question: "Is my payment secure?",
        answerHtml:
          "Absolutely. Your payment is processed through a secure payment infrastructure with appropriate security measures to protect your transaction and payment information. We do not ask you to share your card details, PIN or OTP with us directly.",
      },
      {
        question: "Can I place an order without creating an account?",
        answerHtml:
          "No. Creating an account and signing in are required to place an order on CoGenesis. This helps us manage your orders and provide you with a smoother shopping experience.",
      },
      {
        question: "Can I modify my order after placing it?",
        answerHtml: `
          <p>Yes. You may request changes to your order within <strong>one hour of placing it</strong>, provided the order has not already been processed or dispatched.</p>
          <p>For assistance, please contact us as soon as possible at <a href="mailto:support@cogenesis.in"><strong>support@cogenesis.in</strong></a>, mentioning your order number and the changes you would like to make. Once an order has been processed or dispatched, modifications may no longer be possible.</p>
        `,
      },
    ],
  },
  {
    id: "shipping-delivery",
    label: "Shipping & Delivery",
    items: [
      {
        question: "How long does shipping take?",
        answerHtml:
          "Orders are usually delivered within <strong>5–7 business days</strong> from the date of dispatch. Delivery timelines may vary depending on your location and other logistical factors.",
      },
      {
        question: "Do you offer free shipping?",
        answerHtml:
          "Yes! We offer <strong>free shipping on all orders above ₹2,099</strong>. Orders below this amount may be subject to applicable shipping charges, which will be displayed at checkout.",
      },
      {
        question: "How can I track my order?",
        answerHtml:
          "You can track your order by logging into your CoGenesis account and visiting the <strong>My Orders</strong> section. There, you can view your order details and track its delivery status.",
      },
      {
        question: "Do you ship internationally?",
        answerHtml:
          "Currently, we ship only within India. International shipping is not available at this time.",
      },
    ],
  },
  {
    id: "returns-exchanges",
    label: "Returns & Exchanges",
    items: [
      {
        question: "What is your return policy?",
        answerHtml: `
          <p>We want you to be completely satisfied with your purchase. Returns are subject to our Return &amp; Refund Policy, including the applicable eligibility conditions and timelines.</p>
          <p>For complete details, please refer to our <a href="/refund-policy">Return &amp; Refund Policy</a>.</p>
        `,
      },
      {
        question: "Can I exchange a product?",
        answerHtml: `
          <p>Yes, exchanges are available subject to our exchange policy and product eligibility.</p>
          <p>Please review our <a href="/refund-policy">Return &amp; Refund Policy</a> for information about exchange conditions, timelines, eligibility, and the process for requesting an exchange.</p>
        `,
      },
      {
        question: "How long do refunds take?",
        answerHtml:
          "Once your return has been approved and processed, refunds usually take <strong>10–14 business days</strong> to reflect in your original payment method. The exact time may vary depending on your bank or payment provider.",
      },
    ],
  },
  {
    id: "fabric-care",
    label: "Fabric Care",
    items: [
      {
        question: "How should I care for my garments?",
        answerHtml: `
          <p>Follow these care instructions to maintain your garment:</p>
          <ul>
            <li>Turn the garment inside out before washing.</li>
            <li>Machine wash on a cool cycle.</li>
            <li>Wash with like colors.</li>
            <li>Use only non-chlorine bleach.</li>
            <li>Line dry.</li>
            <li>Do not wring.</li>
            <li>If using a tumble dryer, use low heat.</li>
            <li>Iron on low heat.</li>
          </ul>
          <p>Please preserve the care instructions as provided on the garment label.</p>
        `,
      },
    ],
  },
  {
    id: "account-wishlist",
    label: "Account & Wishlist",
    items: [
      {
        question: "How do I create an account?",
        answerHtml:
          "You can create an account directly on our website using the Sign In option. You can also conveniently sign in or create an account using your Google account.",
      },
      {
        question: "Can I save items for later?",
        answerHtml:
          "Yes! You can save your favorite items to your Wishlist and revisit them whenever you like.",
      },
      {
        question: "Where can I view my orders?",
        answerHtml:
          'You can view and keep track of your orders by visiting the <a href="https://cogenesis.in/account">Orders section in your Account</a>.',
      },
    ],
  },
  {
    id: "privacy-security",
    label: "Privacy & Security",
    items: [
      {
        question: "Is my personal information secure?",
        answerHtml:
          "Yes. We take the security of your personal information seriously and use appropriate measures to help keep your information safe.",
      },
      {
        question: "Do you share customer data?",
        answerHtml:
          "We do not sell or share customer data with third parties. We only share the necessary information with our trusted service providers to help us operate our business and provide our services.",
      },
    ],
  },
  {
    id: "contact-us",
    label: "Contact Us",
    items: [
      {
        question: "How can I contact Cogenesis?",
        answerHtml:
          'You can reach our support team by email at <a href="mailto:support@cogenesis.in"><strong>support@cogenesis.in</strong></a> for any questions, concerns, order-related issues, returns, refunds, exchanges, or other assistance.',
      },
      {
        question: "How quickly can I expect a response?",
        answerHtml:
          "You can expect a response within <strong>2–3 business days</strong>. Our team will do its best to get back to you as soon as possible and assist in resolving your queries.",
      },
    ],
  },
];

export default faqData;
