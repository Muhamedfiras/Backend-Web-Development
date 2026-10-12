const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function toPostRecord(post) {
  if (!post) return null;
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    authorId: post.authorId,
  };
}

async function findAll() {
  const posts = await prisma.post.findMany({
    orderBy: { id: 'asc' },
  });
  return posts.map(toPostRecord);
}

async function findById(id) {
  const numericId = Number(id);
  const post = await prisma.post.findUnique({
    where: { id: numericId },
  });
  return toPostRecord(post);
}

async function create(fields = {}) {
  const title = fields.title;
  const body = fields.body ?? '';
  const authorId = fields.authorId === undefined ? undefined : Number(fields.authorId);
  const post = await prisma.post.create({
    data: {
      title,
      body,
      authorId,
    },
  });
  return toPostRecord(post);
}

async function update(id, patch = {}) {
  const numericId = Number(id);
  try {
    const post = await prisma.post.update({
      where: { id: numericId },
      data: {
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.body !== undefined ? { body: patch.body } : {}),
      },
    });
    return toPostRecord(post);
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

async function remove(id) {
  const numericId = Number(id);
  try {
    await prisma.post.delete({
      where: { id: numericId },
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw error;
  }
}

module.exports = { findAll, findById, create, update, remove };
