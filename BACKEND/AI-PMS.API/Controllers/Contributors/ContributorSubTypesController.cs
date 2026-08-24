
using AI_PMS.Application.DTOs.Contributors;
using AI_PMS.Application.Interfaces.Contributors;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Contributors
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ContributorSubTypesController
        : ControllerBase
    {
        private readonly IContributorSubTypeService
            _service;

        public ContributorSubTypesController(
            IContributorSubTypeService service)
        {
            _service = service;
        }

        // ============================================================
        // GET ALL
        // GET: api/contributorsubtypes
        //
        // ADMIN ONLY
        // ============================================================

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var subTypes =
                await _service
                    .GetAllAsync();

            return Ok(subTypes);
        }

        // ============================================================
        // GET ACTIVE
        // GET: api/contributorsubtypes/active
        //
        // AUTHENTICATED USERS
        // ============================================================

        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var subTypes =
                await _service
                    .GetActiveAsync();

            return Ok(subTypes);
        }

        // ============================================================
        // GET BY CONTRIBUTOR TYPE
        //
        // GET:
        // api/contributorsubtypes/type/{contributorTypeId}
        //
        // Example:
        //
        // GET /api/contributorsubtypes/type/
        // 11111111-1111-1111-1111-111111111111
        //
        // Returns:
        //
        // Frontend Developer
        // Backend Developer
        // Full Stack Developer
        // Other
        // ============================================================

        [HttpGet("type/{contributorTypeId:guid}")]
        public async Task<IActionResult>
            GetByContributorType(
                Guid contributorTypeId)
        {
            try
            {
                var subTypes =
                    await _service
                        .GetByContributorTypeIdAsync(
                            contributorTypeId);

                return Ok(subTypes);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(
                    new
                    {
                        message = ex.Message
                    });
            }
        }

        // ============================================================
        // GET BY ID
        //
        // GET: api/contributorsubtypes/{id}
        //
        // ADMIN ONLY
        // ============================================================

        [HttpGet("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult>
            GetById(Guid id)
        {
            var subType =
                await _service
                    .GetByIdAsync(id);

            if (subType == null)
            {
                return NotFound(
                    new
                    {
                        message =
                            "Contributor subtype not found."
                    });
            }

            return Ok(subType);
        }

        // ============================================================
        // CREATE
        //
        // POST: api/contributorsubtypes
        //
        // ADMIN + MANAGER
        //
        // IMPORTANT:
        // The client sends ONLY:
        //
        // {
        //   "name": "DevOps Engineer",
        //   "description": "...",
        //   "contributorTypeId":
        //      "11111111-1111-1111-1111-111111111111"
        // }
        //
        // NO ID IS SENT.
        //
        // Backend automatically generates:
        //
        // Id = Guid.NewGuid()
        // ============================================================

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Create(
            [FromBody]
            CreateContributorSubTypeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new
                    {
                        message =
                            "Invalid contributor subtype information.",

                        errors =
                            ModelState
                    });
            }

            try
            {
                var subType =
                    await _service
                        .CreateAsync(dto);

                // ----------------------------------------------------
                // Duplicate
                // ----------------------------------------------------

                if (subType == null)
                {
                    return Conflict(
                        new
                        {
                            message =
                                "A contributor subtype with this name already exists under this contributor type."
                        });
                }

                // ----------------------------------------------------
                // Created
                // ----------------------------------------------------

                return CreatedAtAction(
                    nameof(GetById),

                    new
                    {
                        id = subType.Id
                    },

                    subType);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(
                    new
                    {
                        message =
                            ex.Message
                    });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(
                    new
                    {
                        message =
                            ex.Message
                    });
            }
        }

        // ============================================================
        // UPDATE
        //
        // PUT: api/contributorsubtypes/{id}
        //
        // ADMIN ONLY
        // ============================================================

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(
            Guid id,
            [FromBody]
            UpdateContributorSubTypeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new
                    {
                        message =
                            "Invalid contributor subtype information.",

                        errors =
                            ModelState
                    });
            }

            try
            {
                var result =
                    await _service
                        .UpdateAsync(
                            id,
                            dto);

                if (!result)
                {
                    return NotFound(
                        new
                        {
                            message =
                                "Contributor subtype not found."
                        });
                }

                return Ok(
                    new
                    {
                        message =
                            "Contributor subtype updated successfully."
                    });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(
                    new
                    {
                        message =
                            ex.Message
                    });
            }
        }

        // ============================================================
        // DELETE
        //
        // DELETE: api/contributorsubtypes/{id}
        //
        // ADMIN ONLY
        // ============================================================

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(
            Guid id)
        {
            try
            {
                var result =
                    await _service
                        .DeleteAsync(id);

                if (!result)
                {
                    return NotFound(
                        new
                        {
                            message =
                                "Contributor subtype not found."
                        });
                }

                return Ok(
                    new
                    {
                        message =
                            "Contributor subtype deleted successfully."
                    });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(
                    new
                    {
                        message =
                            ex.Message
                    });
            }
        }
    }
}
