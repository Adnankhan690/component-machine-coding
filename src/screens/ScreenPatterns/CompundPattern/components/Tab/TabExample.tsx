import Tab from "./Tab";
import "./Tab.css";

export default function TabExample() {
	return (
		<div className="tab-container">
			<Tab>
				<Tab.TabList className="tab-list">
					<Tab.TabTrigger
						defaultTab
						value="profile"
						className="tab-trigger"
						activeClassName="active">
						Profile
					</Tab.TabTrigger>
					<Tab.TabTrigger
						value="settings"
						className="tab-trigger"
						activeClassName="active">
						Settings
					</Tab.TabTrigger>
					<Tab.TabTrigger
						value="notifications"
						className="tab-trigger"
						activeClassName="active">
						Alerts
					</Tab.TabTrigger>
				</Tab.TabList>

				<Tab.TabContent value="profile" className="tab-content">
					<div className="content-header">User Profile</div>
					<div className="profile-card">
						<div className="avatar">AK</div>
						<div>
							<div className="form-value">Adnan Khan</div>
							<div className="form-label">Full Stack Developer</div>
						</div>
					</div>
					<div className="content-body" style={{ marginTop: "1rem" }}>
						Managing components and patterns in the machine coding workspace.
						Passionate about clean code and UI/UX.
					</div>
				</Tab.TabContent>

				<Tab.TabContent value="settings" className="tab-content">
					<div className="content-header">Account Settings</div>
					<div className="form-group">
						<label className="form-label">Email Address</label>
						<div className="form-value">adnan.khan@example.com</div>
					</div>
					<div className="form-group">
						<label className="form-label">Timezone</label>
						<div className="form-value">Asia/Kolkata (GMT +5:30)</div>
					</div>
					<div className="form-group">
						<label className="form-label">Account Type</label>
						<div className="form-value">Premium Member</div>
					</div>
				</Tab.TabContent>

				<Tab.TabContent value="notifications" className="tab-content">
					<div className="content-header">Notifications</div>
					<div className="content-body">
						<p>You have no unread notifications.</p>
						<div
							style={{
								padding: "12px",
								background: "rgba(255, 255, 255, 0.05)",
								borderRadius: "8px",
								marginTop: "12px",
							}}>
							<span style={{ color: "#a855f7" }}>[NEW]</span> Compound pattern
							implementation successful!
						</div>
					</div>
				</Tab.TabContent>
			</Tab>
		</div>
	);
}
