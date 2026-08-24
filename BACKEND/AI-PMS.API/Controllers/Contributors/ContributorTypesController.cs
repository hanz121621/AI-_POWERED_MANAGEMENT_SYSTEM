
using AI_PMS.Application.DTOs.Contributors;
using AI_PMS.Application.Interfaces.Contributors;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Contributors
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ContributorTypesController
        : ControllerBase
    {
        private readonly IContributorTypeService
            _service;

        public ContributorTypesController(
            IContributorTypeService service)
        {
            _service = service;
        }

        // =====================================================
        // GET: api/contributortypes
        // ADMIN - GET ALL TYPES
        // =====================================================

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var types =
                await _service.GetAllAsync();

            return Ok(types);
        }

        // =====================================================
        // GET: api/contributortypes/active
        // AUTHENTICATED USERS - GET ACTIVE TYPES
        // =====================================================

        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var types =
                await _service.GetActiveAsync();

            return Ok(types);
        }

        // =====================================================
        // GET: api/contributortypes/{id}
        // ADMIN - GET TYPE
        // =====================================================

        [HttpGet("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(
            Guid id)
        {
            var type =
                await _service.GetByIdAsync(id);

            if (type == null)
            {
                return NotFound(new
                {
                    message =
                        "Contributor type not found."
                });
            }

            return Ok(type);
        }

        // =====================================================
        // POST: api/contributortypes
        // ADMIN - CREATE TYPE
        // =====================================================

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(
            [FromBody] CreateContributorTypeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message =
                        "Invalid contributor type information.",
                    errors = ModelState
                });
            }

            try
            {
                var type =
                    await _service.CreateAsync(dto);

                if (type == null)
                {
                    return Conflict(new
                    {
                        message =
                            "A contributor type with this name already exists."
                    });
                }

                return CreatedAtAction(
                    nameof(GetById),
                    new
                    {
                        id = type.Id
                    },
                    type);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }

        // =====================================================
        // PUT: api/contributortypes/{id}
        // ADMIN - UPDATE TYPE
        // =====================================================

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(
            Guid id,
            [FromBody] UpdateContributorTypeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message =
                        "Invalid contributor type information.",
                    errors = ModelState
                });
            }

            try
            {
                var result =
                    await _service.UpdateAsync(
                        id,
                        dto);

                if (!result)
                {
                    return NotFound(new
                    {
                        message =
                            "Contributor type not found."
                    });
                }

                return Ok(new
                {
                    message =
                        "Contributor type updated successfully."
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }

        // =====================================================
        // DELETE: api/contributortypes/{id}
        // ADMIN - DELETE TYPE
        // =====================================================

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(
            Guid id)
        {
            try
            {
                var result =
                    await _service.DeleteAsync(id);

                if (!result)
                {
                    return NotFound(new
                    {
                        message =
                            "Contributor type not found."
                    });
                }

                return Ok(new
                {
                    message =
                        "Contributor type deleted successfully."
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }
    }
}

