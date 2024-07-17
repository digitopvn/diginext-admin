import { trimEnd } from "lodash";

import type { GitProviderType } from "@/api/api-types";

export interface GitRepoData {
	namespace?: string;
	repoSlug?: string;
	/**
	 * @example org-slug/repo-slug
	 */
	fullSlug?: string;
	/**
	 * @example github.com, bitbucket.org,...
	 */
	gitDomain?: string;
	/**
	 * Git provider type
	 */
	gitProvider?: GitProviderType;
}

/**
 * Read git data in a repo SSH url
 * @param {string} repoSSH - Example: `git@bitbucket.org:organization-name/git-repo-slug.git`
 */
export function parseGitRepoDataFromRepoSSH(repoSSH: string): GitRepoData {
	if (!repoSSH) return {};

	let namespace: string | undefined;
	let repoSlug: string | undefined;
	let gitDomain: string | undefined;
	let gitProvider: GitProviderType | undefined;

	try {
		namespace = repoSSH.split(":")[1]?.split("/")[0];
	} catch (e) {
		throw new Error(`Repository SSH (${repoSSH}) is invalid`);
	}

	try {
		repoSlug = repoSSH.split(":")[1]?.split("/")[1]?.split(".")[0];
	} catch (e) {
		throw new Error(`Repository SSH (${repoSSH}) is invalid`);
	}

	try {
		gitDomain = repoSSH.split(":")[0]?.split("@")[1];
	} catch (e) {
		throw new Error(`Repository SSH (${repoSSH}) is invalid`);
	}

	try {
		gitProvider = gitDomain?.split(".")[0] as GitProviderType;
	} catch (e) {
		throw new Error(`Repository SSH (${repoSSH}) is invalid`);
	}

	const fullSlug = `${namespace}/${repoSlug}`;

	return { namespace, repoSlug, fullSlug, gitDomain, gitProvider };
}

/**
 * Read git data in a git repo url
 * @param {string} repoURL - Example: `https://bitbucket.org/organization-name/git-repo-slug`
 */
export function parseGitRepoDataFromRepoURL(repoURL: string): GitRepoData {
	if (!repoURL) return {};

	let gitProvider: GitProviderType | undefined;

	let _repoURL = trimEnd(repoURL, "/");
	_repoURL = trimEnd(_repoURL, "#");
	if (_repoURL.indexOf(".git") > -1) _repoURL = _repoURL.substring(0, _repoURL.indexOf(".git"));
	if (_repoURL.indexOf("?") > -1) _repoURL = _repoURL.substring(0, _repoURL.indexOf("?"));
	// console.log(_repoURL);

	const [gitDomain, namespace, repoSlug] = _repoURL.split("://")[1]?.split("/") || [];

	try {
		gitProvider = gitDomain?.split(".")[0] as GitProviderType;
	} catch (e) {
		throw new Error(`Repository SSH (${_repoURL}) is invalid`);
	}

	const fullSlug = `${namespace}/${repoSlug}`;

	return { namespace, repoSlug, fullSlug, gitDomain, gitProvider };
}

/**
 * Generate git repo SSH url from a git repo URL
 * @example "git@github.com:digitopvn/diginext.git" -> "https://github.com/digitopvn/diginext"
 */
export function repoUrlToRepoSSH(repoSSH: string) {
	const repoData = parseGitRepoDataFromRepoSSH(repoSSH);
	if (!repoData) throw new Error(`Unable to parse: ${repoSSH}`);
	return `https://${repoData.gitDomain}/${repoData.fullSlug}`;
}

/**
 * Generate git repo URL from a git repo SSH url
 * @example "https://github.com/digitopvn/diginext" -> "git@github.com:digitopvn/diginext.git"
 */
export function repoSshToRepoURL(repoURL: string) {
	const repoData = parseGitRepoDataFromRepoURL(repoURL);
	if (!repoData) throw new Error(`Unable to parse: ${repoURL}`);
	return `git@${repoData.gitDomain}:${repoData.fullSlug}.git`;
}
