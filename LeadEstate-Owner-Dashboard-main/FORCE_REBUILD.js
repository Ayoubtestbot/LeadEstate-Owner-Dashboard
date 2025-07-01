// FORCE REBUILD - CACHE BUSTING
// This file forces Vercel to generate completely new build hashes
// Current issue: Vercel serving old index-be4373dd.js instead of new files

const FORCE_REBUILD_TIMESTAMP = Date.now();
const BUILD_ID = `build-${FORCE_REBUILD_TIMESTAMP}`;

console.log(`🚨 FORCE REBUILD: ${BUILD_ID}`);
console.log(`🔄 Cache busting timestamp: ${FORCE_REBUILD_TIMESTAMP}`);

export { FORCE_REBUILD_TIMESTAMP, BUILD_ID };
