"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import AuthTabs from "./AuthTabs";
import RegisterOrgForm from "./RegisterOrgForm";
import RegisterUserForm from "./RegisterUserForm";
import Link from "next/link";

const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"admin" | "user">("admin");
  const t = useTranslations("pages.registerPage");
  const tLogin = useTranslations("pages.login");

  return (
    <section className="flex flex-col gap-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-[#1a1a6e]">
        {t("title")}
      </h1>

      {/* Tabs */}
      <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Form */}
      {activeTab === "admin" ? <RegisterOrgForm /> : <RegisterUserForm />}

      {/* Link to login */}
      <p className="text-sm text-center text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold hover:underline"
          style={{ color: "#1a1a6e" }}
        >
          {tLogin("title")}
        </Link>
      </p>
    </section>
  );
};

export default RegisterPage;