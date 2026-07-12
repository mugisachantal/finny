import { useState } from "react";
import { AdminSidebar } from "../../components/admin/admin-sidebar";
import {
  LuSettings,
  LuShield,
  LuBell,
  LuUsers,
  LuBuilding2,
  LuGlobe,
  LuLock,
  LuSave,
  LuCircleCheckBig,
  LuTriangleAlert,
  LuInfo,
  LuKey,
  LuDatabase,
  LuMail,
} from "react-icons/lu";

interface SettingSection {
  id: string;
  label: string;
  icon: typeof LuSettings;
  description: string;
}

const sections: SettingSection[] = [
  { id: "general", label: "General", icon: LuSettings, description: "Platform name, logo, and basic settings" },
  { id: "security", label: "Security", icon: LuShield, description: "Authentication, encryption, and access control" },
  { id: "notifications", label: "Notifications", icon: LuBell, description: "Email, SMS, and push notification settings" },
  { id: "lenders", label: "Lender Policies", icon: LuBuilding2, description: "Verification requirements and compliance rules" },
  { id: "users", label: "User Policies", icon: LuUsers, description: "Registration, consent, and data retention" },
  { id: "api", label: "API & Integrations", icon: LuGlobe, description: "External service connections and rate limits" },
];

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState("general");
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    platformName: "Finny",
    supportEmail: "support@finny.ug",
    supportPhone: "+256 200 911 882",
    maintenanceMode: false,
    twoFactorRequired: true,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    passwordMinLength: "8",
    requireStrongPassword: true,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    lenderVerificationRequired: true,
    minDocumentsRequired: "3",
    autoRejectIncomplete: false,
    dataRetentionDays: "365",
    consentExpiryDays: "90",
    maxLoanOffersPerUser: "10",
    apiRateLimit: "1000",
    webhookUrl: "",
    enableAnalytics: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative ${
        checked ? "bg-[color:var(--color-ebony)]" : "bg-[color:var(--color-dust-grey)]"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );

  const InputField = ({
    label,
    value,
    onChange,
    type = "text",
    suffix,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    suffix?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-[color:var(--color-charcoal)] mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-[color:var(--color-dust-grey)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-muted-teal)] bg-white"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[color:var(--color-charcoal)]/50">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[color:var(--color-soft-linen)]">
      <AdminSidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[color:var(--color-ebony)]">Settings</h1>
              <p className="text-[color:var(--color-charcoal)]/60 mt-1">
                Configure platform settings, security, and policies
              </p>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[color:var(--color-ebony)] text-white hover:bg-[color:var(--color-ebony)]/90 transition-colors text-sm font-medium"
            >
              {saved ? <LuCircleCheckBig className="w-4 h-4" /> : <LuSave className="w-4 h-4" />}
              <span>{saved ? "Saved!" : "Save Changes"}</span>
            </button>
          </div>

          <div className="flex gap-6">
            {/* Settings Navigation */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl overflow-hidden sticky top-8">
                <div className="p-4 space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeSection === section.id
                          ? "bg-[color:var(--color-ebony)] text-white"
                          : "text-[color:var(--color-charcoal)]/60 hover:bg-[color:var(--color-soft-linen)]"
                      }`}
                    >
                      <section.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 space-y-6">
              {/* General Settings */}
              {activeSection === "general" && (
                <>
                  <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-[color:var(--color-ebony)] mb-1">General Settings</h2>
                    <p className="text-sm text-[color:var(--color-charcoal)]/50 mb-6">Basic platform configuration</p>

                    <div className="space-y-5">
                      <InputField
                        label="Platform Name"
                        value={settings.platformName}
                        onChange={(v) => setSettings({ ...settings, platformName: v })}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Support Email"
                          value={settings.supportEmail}
                          onChange={(v) => setSettings({ ...settings, supportEmail: v })}
                        />
                        <InputField
                          label="Support Phone"
                          value={settings.supportPhone}
                          onChange={(v) => setSettings({ ...settings, supportPhone: v })}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-[color:var(--color-soft-linen)]">
                        <div>
                          <p className="text-sm font-medium text-[color:var(--color-charcoal)]">Maintenance Mode</p>
                          <p className="text-xs text-[color:var(--color-charcoal)]/50">Temporarily disable public access</p>
                        </div>
                        <Toggle
                          checked={settings.maintenanceMode}
                          onChange={(v) => setSettings({ ...settings, maintenanceMode: v })}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Security Settings */}
              {activeSection === "security" && (
                <>
                  <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-[color:var(--color-ebony)] mb-1">Security Settings</h2>
                    <p className="text-sm text-[color:var(--color-charcoal)]/50 mb-6">Authentication and access control</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-[color:var(--color-dust-grey)]">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-[color:var(--color-muted-teal)]/20 flex items-center justify-center">
                            <LuKey className="w-5 h-5 text-[color:var(--color-ebony)]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[color:var(--color-charcoal)]">Require Two-Factor Authentication</p>
                            <p className="text-xs text-[color:var(--color-charcoal)]/50">For all admin accounts</p>
                          </div>
                        </div>
                        <Toggle checked={settings.twoFactorRequired} onChange={(v) => setSettings({ ...settings, twoFactorRequired: v })} />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl border border-[color:var(--color-dust-grey)]">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-[color:var(--color-muted-teal)]/20 flex items-center justify-center">
                            <LuLock className="w-5 h-5 text-[color:var(--color-ebony)]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[color:var(--color-charcoal)]">Require Strong Passwords</p>
                            <p className="text-xs text-[color:var(--color-charcoal)]/50">Minimum 8 chars, uppercase, number, symbol</p>
                          </div>
                        </div>
                        <Toggle checked={settings.requireStrongPassword} onChange={(v) => setSettings({ ...settings, requireStrongPassword: v })} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <InputField
                          label="Session Timeout"
                          value={settings.sessionTimeout}
                          onChange={(v) => setSettings({ ...settings, sessionTimeout: v })}
                          suffix="minutes"
                        />
                        <InputField
                          label="Max Login Attempts"
                          value={settings.maxLoginAttempts}
                          onChange={(v) => setSettings({ ...settings, maxLoginAttempts: v })}
                        />
                      </div>

                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3">
                        <LuTriangleAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Security Notice</p>
                          <p className="text-xs text-amber-700 mt-1">
                            Changes to security settings will require all admin users to re-authenticate on their next login.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Notification Settings */}
              {activeSection === "notifications" && (
                <>
                  <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-[color:var(--color-ebony)] mb-1">Notification Settings</h2>
                    <p className="text-sm text-[color:var(--color-charcoal)]/50 mb-6">Configure how users and admins receive notifications</p>

                    <div className="space-y-4">
                      {[
                        { key: "emailNotifications" as const, icon: LuMail, label: "Email Notifications", desc: "Send alerts and updates via email" },
                        { key: "smsNotifications" as const, icon: LuBell, label: "SMS Notifications", desc: "Send critical alerts via SMS" },
                        { key: "pushNotifications" as const, icon: LuBell, label: "Push Notifications", desc: "Browser and mobile push alerts" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-[color:var(--color-dust-grey)]">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-[color:var(--color-muted-teal)]/20 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-[color:var(--color-ebony)]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[color:var(--color-charcoal)]">{item.label}</p>
                              <p className="text-xs text-[color:var(--color-charcoal)]/50">{item.desc}</p>
                            </div>
                          </div>
                          <Toggle checked={settings[item.key]} onChange={(v) => setSettings({ ...settings, [item.key]: v })} />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Lender Policies */}
              {activeSection === "lenders" && (
                <>
                  <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-[color:var(--color-ebony)] mb-1">Lender Policies</h2>
                    <p className="text-sm text-[color:var(--color-charcoal)]/50 mb-6">Verification requirements and compliance rules</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-[color:var(--color-dust-grey)]">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-[color:var(--color-muted-teal)]/20 flex items-center justify-center">
                            <LuShield className="w-5 h-5 text-[color:var(--color-ebony)]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[color:var(--color-charcoal)]">Require Manual Verification</p>
                            <p className="text-xs text-[color:var(--color-charcoal)]/50">Admin must approve each lender</p>
                          </div>
                        </div>
                        <Toggle checked={settings.lenderVerificationRequired} onChange={(v) => setSettings({ ...settings, lenderVerificationRequired: v })} />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl border border-[color:var(--color-dust-grey)]">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-[color:var(--color-muted-teal)]/20 flex items-center justify-center">
                            <LuDatabase className="w-5 h-5 text-[color:var(--color-ebony)]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[color:var(--color-charcoal)]">Auto-Reject Incomplete Applications</p>
                            <p className="text-xs text-[color:var(--color-charcoal)]/50">Reject after 14 days if docs missing</p>
                          </div>
                        </div>
                        <Toggle checked={settings.autoRejectIncomplete} onChange={(v) => setSettings({ ...settings, autoRejectIncomplete: v })} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <InputField
                          label="Minimum Documents Required"
                          value={settings.minDocumentsRequired}
                          onChange={(v) => setSettings({ ...settings, minDocumentsRequired: v })}
                          suffix="documents"
                        />
                        <InputField
                          label="Max Loan Offers Per User"
                          value={settings.maxLoanOffersPerUser}
                          onChange={(v) => setSettings({ ...settings, maxLoanOffersPerUser: v })}
                          suffix="offers"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* User Policies */}
              {activeSection === "users" && (
                <>
                  <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-[color:var(--color-ebony)] mb-1">User Policies</h2>
                    <p className="text-sm text-[color:var(--color-charcoal)]/50 mb-6">Registration, consent, and data retention</p>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Data Retention Period"
                          value={settings.dataRetentionDays}
                          onChange={(v) => setSettings({ ...settings, dataRetentionDays: v })}
                          suffix="days"
                        />
                        <InputField
                          label="Consent Expiry"
                          value={settings.consentExpiryDays}
                          onChange={(v) => setSettings({ ...settings, consentExpiryDays: v })}
                          suffix="days"
                        />
                      </div>

                      <div className="p-4 rounded-xl bg-[color:var(--color-soft-linen)] flex items-start space-x-3">
                        <LuInfo className="w-5 h-5 text-[color:var(--color-ebony)] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-[color:var(--color-charcoal)]">Data Retention Info</p>
                          <p className="text-xs text-[color:var(--color-charcoal)]/60 mt-1">
                            User data will be automatically purged after the retention period expires. Active accounts and loan records are exempt from auto-deletion.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* API Settings */}
              {activeSection === "api" && (
                <>
                  <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-[color:var(--color-ebony)] mb-1">API & Integrations</h2>
                    <p className="text-sm text-[color:var(--color-charcoal)]/50 mb-6">External service connections and rate limits</p>

                    <div className="space-y-4">
                      <InputField
                        label="API Rate Limit"
                        value={settings.apiRateLimit}
                        onChange={(v) => setSettings({ ...settings, apiRateLimit: v })}
                        suffix="requests/min"
                      />
                      <InputField
                        label="Webhook URL"
                        value={settings.webhookUrl}
                        onChange={(v) => setSettings({ ...settings, webhookUrl: v })}
                      />

                      <div className="flex items-center justify-between p-4 rounded-xl border border-[color:var(--color-dust-grey)]">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-[color:var(--color-muted-teal)]/20 flex items-center justify-center">
                            <LuGlobe className="w-5 h-5 text-[color:var(--color-ebony)]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[color:var(--color-charcoal)]">Enable Analytics Tracking</p>
                            <p className="text-xs text-[color:var(--color-charcoal)]/50">Track platform usage and lender engagement</p>
                          </div>
                        </div>
                        <Toggle checked={settings.enableAnalytics} onChange={(v) => setSettings({ ...settings, enableAnalytics: v })} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Save Bar */}
              <div className="flex items-center justify-between p-4 bg-white border border-[color:var(--color-dust-grey)] rounded-2xl">
                <p className="text-sm text-[color:var(--color-charcoal)]/50">
                  Changes are saved when you click "Save Changes"
                </p>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[color:var(--color-ebony)] text-white hover:bg-[color:var(--color-ebony)]/90 transition-colors text-sm font-medium"
                >
                  {saved ? <LuCircleCheckBig className="w-4 h-4" /> : <LuSave className="w-4 h-4" />}
                  <span>{saved ? "Saved Successfully!" : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
