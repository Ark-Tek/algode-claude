import { Octokit } from '@octokit/rest';
import matter from 'gray-matter';

// Toda la escritura de contenido pasa por aquí. El token de GitHub NUNCA
// llega al navegador — vive solo en esta función server-side, leída de una
// variable de entorno sin el prefijo PUBLIC_ (Astro no la incluye en el
// bundle del cliente). El panel de admin llama a estas funciones desde el
// frontmatter de las páginas .astro o desde endpoints /api, nunca desde
// JavaScript que corra en el navegador.

function getConfig() {
  const token = import.meta.env.GITHUB_TOKEN;
  const owner = import.meta.env.GITHUB_OWNER;
  const repo = import.meta.env.GITHUB_REPO;
  const branch = import.meta.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) {
    throw new Error(
      'Faltan variables de entorno GITHUB_TOKEN, GITHUB_OWNER o GITHUB_REPO. Configúralas en Vercel.'
    );
  }
  return { token, owner, repo, branch };
}

function getClient() {
  const { token } = getConfig();
  return new Octokit({ auth: token });
}

export interface CmsFile {
  path: string;
  slug: string;
  data: Record<string, unknown>;
  body: string;
  sha: string;
}

/** Lista los archivos .md de una carpeta del repo (p.ej. "src/content/courses"). */
export async function listMarkdownFiles(dirPath: string): Promise<{ name: string; slug: string }[]> {
  const octokit = getClient();
  const { owner, repo, branch } = getConfig();

  const { data } = await octokit.repos.getContent({ owner, repo, path: dirPath, ref: branch });
  if (!Array.isArray(data)) return [];

  return data
    .filter((item) => item.type === 'file' && item.name.endsWith('.md'))
    .map((item) => ({ name: item.name, slug: item.name.replace(/\.md$/, '') }));
}

/** Lee un archivo .md del repo y separa frontmatter (data) del cuerpo (body). */
export async function readMarkdownFile(filePath: string): Promise<CmsFile> {
  const octokit = getClient();
  const { owner, repo, branch } = getConfig();

  const { data } = await octokit.repos.getContent({ owner, repo, path: filePath, ref: branch });
  if (Array.isArray(data) || data.type !== 'file' || !('content' in data)) {
    throw new Error(`No se pudo leer el archivo: ${filePath}`);
  }

  const raw = Buffer.from(data.content, 'base64').toString('utf-8');
  const parsed = matter(raw);
  const slug = filePath.split('/').pop()!.replace(/\.md$/, '');

  return { path: filePath, slug, data: parsed.data, body: parsed.content, sha: data.sha };
}

/**
 * Crea o actualiza un archivo .md en el repo, lo que genera un commit real
 * y dispara el redeploy automático en Vercel (igual que un `git push` tuyo).
 * Si `sha` se omite, GitHub asume que es un archivo nuevo.
 */
export async function writeMarkdownFile(
  filePath: string,
  data: Record<string, unknown>,
  body: string,
  commitMessage: string,
  sha?: string
): Promise<void> {
  const octokit = getClient();
  const { owner, repo, branch } = getConfig();

  const fileContent = matter.stringify(body ?? '', data);
  const contentBase64 = Buffer.from(fileContent, 'utf-8').toString('base64');

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    branch,
    path: filePath,
    message: commitMessage,
    content: contentBase64,
    sha,
  });
}

/** Convierte un texto libre en un slug válido para nombre de archivo/URL. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
