package main

import (
	"fmt"
	"github.com/jasonlvhit/gocron"
)

func Cleanup() {
	fmt.Println("I am running task.")
}

func taskWithParams(a int, b string) {
	fmt.Println(a, b)
}

func main() {
	// Do jobs without params
	gocron.Every(1).Second().Do(Cleanup)
	gocron.Every(10).Second().Do(taskWithParams, 1, "hello")

	// Start all the pending jobs
	<-gocron.Start()

}

/*
1. Database Cleanup Scripts
Delete Inactive Accounts: Remove or anonymize accounts that have been inactive for a specific period (e.g., 1-2 years).
Remove Unverified Accounts: Delete accounts that have not been verified within a certain timeframe (e.g., 7 days).
Purge Old Sessions: Delete expired session tokens and session data to free up space.
Archive/Remove Old Content: Archive or delete posts, comments, and messages older than a certain age, depending on user settings and platform policies.
Delete Orphaned Data: Remove data that has no parent reference, like images or posts linked to deleted users.
Prune Stale Notifications: Remove notifications that are older than a specific timeframe (e.g., 30-90 days).
Clear Failed Login Attempts: Delete records of failed login attempts after a certain period to prevent database bloat.
Clean Up Temporary Data: Remove temporary or cache data stored in the database, such as temporary uploads, draft posts, or one-time tokens.


2. Media and Storage Cleanup Scripts
Delete Unused Media Files: Remove images, videos, and other media files that are not linked to any posts or profiles.
Compress Old Media: Compress images and videos older than a certain age to save disk space.
Purge Expired Files: Remove files like expired profile pictures, cover photos, or attachments linked to deleted content.
Clear Temporary Uploads: Delete files in temporary upload directories that have not been moved to permanent storage within a specific timeframe.


3. Cache and Log Cleanup Scripts
Clear Application Cache: Purge expired or unused cache entries (e.g., user profiles, content feeds).
Prune Old Logs: Remove or archive application and server logs older than a specified age (e.g., 30 days).
Clear CDN Cache: Invalidate and remove stale cached assets from Content Delivery Network (CDN) nodes.


4. Content Moderation Cleanup Scripts
Remove Reported Content: Automatically delete content that has been flagged as violating terms of service after review.
Purge Spam Accounts: Identify and delete accounts flagged for spam or abusive behavior.
Delete Banned Content: Remove content (posts, comments, etc.) created by banned users or that violates community guidelines.
Automated Content Sweep: Periodically run scripts to detect and flag inappropriate content using predefined filters or machine learning models.


5. User Data Cleanup Scripts
Anonymize Deleted Users' Data: Replace user-identifiable information with anonymized placeholders for users who have requested account deletion.
Remove Old Friend/Follow Requests: Delete friend or follow requests that have not been accepted or rejected within a specified period.
Prune Old Likes/Reactions: Delete likes, reactions, or endorsements on posts that are no longer active or relevant.


6. Security and Privacy Cleanup Scripts
Clear Personal Data on Request: Remove or anonymize user data in compliance with GDPR, CCPA, or other privacy regulations upon user request.
Purge Two-Factor Authentication Data: Remove old or unused two-factor authentication tokens and backup codes.
Clean Up API Tokens: Invalidate and delete expired or unused API tokens.


7. Analytics and Metrics Cleanup Scripts
Prune Old Analytics Data: Remove or aggregate old analytics data (e.g., daily active users, page views) to maintain performance and reduce storage usage.
Delete Old A/B Test Data: Remove data from completed A/B tests that are no longer relevant.


8. System Maintenance Scripts
Optimize Database: Run database optimization tasks like vacuuming, reindexing, or table partitioning to enhance performance.
Defragment Storage: If using a file system, periodically defragment storage to improve access times.
Clear Failed Jobs: Remove records of failed background jobs that have been logged in job queues or worker logs.


9. Automated Review Cleanup
Remove Old Review Data: Delete old content reviews and moderation logs that are no longer needed.
Archive Historical Data: Move data older than a certain period to cold storage or an archival system for long-term retention.
These cleanup scripts help to maintain a responsive, secure, and user-friendly social media platform while ensuring compliance with privacy and data retention policies.*/
