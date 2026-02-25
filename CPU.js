const buildR = (opcode, f3, f7, rd, rs1, rs2) => ((opcode | (rd << 7) | (f3 << 12) | (rs1 << 15) | (rs2 << 20) | (f7 << 25)) >>> 0);
const buildI = (opcode, f3, rd, rs1, imm)     => ((opcode | (rd << 7) | (f3 << 12) | (rs1 << 15) | ((imm & 0xFFF) << 20)) >>> 0);
const buildS = (opcode, f3, rs1, rs2, imm)    => ((opcode | ((imm & 0x1F) << 7) | (f3 << 12) | (rs1 << 15) | (rs2 << 20) | (((imm >> 5) & 0x7F) << 25)) >>> 0);
const buildB = (opcode, f3, rs1, rs2, imm)    => ((opcode | (((imm >> 11) & 1) << 7) | (((imm >> 1) & 0xF) << 8) | (f3 << 12) | (rs1 << 15) | (rs2 << 20) | (((imm >> 5) & 0x3F) << 25) | (((imm >> 12) & 1) << 31)) >>> 0);
const buildU = (opcode, rd, imm)              => ((opcode | (rd << 7) | (imm & 0xFFFFF000)) >>> 0);
const buildJ = (opcode, rd, imm)              => ((opcode | (rd << 7) | (((imm >> 12) & 0xFF) << 12) | (((imm >> 11) & 1) << 20) | (((imm >> 1) & 0x3FF) << 21) | (((imm >> 20) & 1) << 31)) >>> 0);
const RV64IMAFDGCCPU = {
 // ==========================================
  // ARITHMETIC LOGIC UNIT (ALU)
  // Handles all integer math, logic, and control flow
  // ==========================================
  ALU: {
    Base: {
      // Immediate
      addi: null, slti: null, sltiu: null, xori: null, ori: null, andi: null,
      // Register
      add: null, sub: null, slt: null, sltu: null, xor: null, or: null, and: null,
      // RV64 Word (32-bit)
      addiw: null, addw: null, subw: null,
      // Addressing
      lui: null, auipc: null
    },
    Shifts: {
      slli: null, srli: null, srai: null,
      sll: null, srl: null, sra: null,
      slliw: null, srliw: null, sraiw: null,
      sllw: null, srlw: null, sraw: null
    },
    Jumps: {
      jal: null, jalr: null
    },
    Branches: {
      beq: null, bne: null, blt: null, bge: null, bltu: null, bgeu: null
    },
    M: {
      // 64-bit Multiplication/Division
      mul: null, mulh: null, mulhsu: null, mulhu: null,
      div: null, divu: null, rem: null, remu: null,
      // 32-bit Multiplication/Division (RV64)
      mulw: null, divw: null, divuw: null, remw: null, remuw: null
    }
  },
  // ==========================================
  // LOAD/STORE UNIT (LSU)
  // Handles all memory reading, writing, and atomics
  // ==========================================
  LSU: {
    Base: {
      // Loads
      lb: null, lh: null, lw: null, lbu: null, lhu: null, lwu: null, ld: null,
      // Stores
      sb: null, sh: null, sw: null, sd: null
    },
    A: {
      // 32-bit Atomics
      lr_w: null, sc_w: null, amoswap_w: null, amoadd_w: null, amoxor_w: null,
      amoand_w: null, amoor_w: null, amomin_w: null, amomax_w: null,
      amominu_w: null, amomaxu_w: null,
      // 64-bit Atomics
      lr_d: null, sc_d: null, amoswap_d: null, amoadd_d: null, amoxor_d: null,
      amoand_d: null, amoor_d: null, amomin_d: null, amomax_d: null,
      amominu_d: null, amomaxu_d: null
    }
  },
  // ==========================================
  // FLOATING-POINT ALU (FALU)
  // ==========================================
  FALU: {
    F: {
      flw: null, fsw: null,
      fmadd_s: null, fmsub_s: null, fnmsub_s: null, fnmadd_s: null,
      fadd_s: null, fsub_s: null, fmul_s: null, fdiv_s: null, fsqrt_s: null,
      fsgnj_s: null, fsgnjn_s: null, fsgnjx_s: null, fmin_s: null, fmax_s: null,
      fcvt_w_s: null, fcvt_wu_s: null, fcvt_s_w: null, fcvt_s_wu: null,
      fmv_x_w: null, fmv_w_x: null,
      feq_s: null, flt_s: null, fle_s: null, fclass_s: null,
      // RV64 specific
      fcvt_l_s: null, fcvt_lu_s: null, fcvt_s_l: null, fcvt_s_lu: null
    },
    D: {
      fld: null, fsd: null,
      fmadd_d: null, fmsub_d: null, fnmsub_d: null, fnmadd_d: null,
      fadd_d: null, fsub_d: null, fmul_d: null, fdiv_d: null, fsqrt_d: null,
      fsgnj_d: null, fsgnjn_d: null, fsgnjx_d: null, fmin_d: null, fmax_d: null,
      fcvt_s_d: null, fcvt_d_s: null, fcvt_w_d: null, fcvt_wu_d: null,
      fcvt_d_w: null, fcvt_d_wu: null, feq_d: null, flt_d: null,
      fle_d: null, fclass_d: null,
      // RV64 specific
      fcvt_l_d: null, fcvt_lu_d: null, fcvt_d_l: null, fcvt_d_lu: null,
      fmv_x_d: null, fmv_d_x: null
    },
    Q: {
      flq: null, fsq: null,
      fmadd_q: null, fmsub_q: null, fnmsub_q: null, fnmadd_q: null,
      fadd_q: null, fsub_q: null, fmul_q: null, fdiv_q: null, fsqrt_q: null,
      fsgnj_q: null, fsgnjn_q: null, fsgnjx_q: null, fmin_q: null, fmax_q: null,
      fcvt_s_q: null, fcvt_q_s: null, fcvt_d_q: null, fcvt_q_d: null,
      fcvt_w_q: null, fcvt_wu_q: null, fcvt_q_w: null, fcvt_q_wu: null,
      feq_q: null, flt_q: null, fle_q: null, fclass_q: null,
      // RV64 specific
      fcvt_l_q: null, fcvt_lu_q: null, fcvt_q_l: null, fcvt_q_lu: null
    },
    Zfh: {
      flh: null, fsh: null,
      fmadd_h: null, fmsub_h: null, fnmsub_h: null, fnmadd_h: null,
      fadd_h: null, fsub_h: null, fmul_h: null, fdiv_h: null, fsqrt_h: null,
      fsgnj_h: null, fsgnjn_h: null, fsgnjx_h: null, fmin_h: null, fmax_h: null,
      fcvt_s_h: null, fcvt_h_s: null, fcvt_d_h: null, fcvt_h_d: null,
      fcvt_q_h: null, fcvt_h_q: null, fcvt_w_h: null, fcvt_wu_h: null,
      fcvt_h_w: null, fcvt_h_wu: null, fmv_x_h: null, fmv_h_x: null,
      feq_h: null, flt_h: null, fle_h: null, fclass_h: null,
      // RV64 specific
      fcvt_l_h: null, fcvt_lu_h: null, fcvt_h_l: null, fcvt_h_lu: null
    }
  },
  // ==========================================
  // SYSTEM AND ENVIRONMENT
  // ==========================================
  System: {
    Base: {
      ecall: null, ebreak: null, fence: null
    },
    Zicsr: {
      csrrw: null, csrrs: null, csrrc: null,
      csrrwi: null, csrrsi: null, csrrci: null
    },
    Zifencei: {
      fence_i: null
    }
  },
  // ==========================================
  // COMPRESSED INSTRUCTIONS (C)
  // ==========================================
  C: {
    LoadsStores: {
      c_lwsp: null, c_ldsp: null, c_lqsp: null, c_flwsp: null, c_fldsp: null,
      c_swsp: null, c_sdsp: null, c_sqsp: null, c_fswsp: null, c_fsdsp: null,
      c_lw: null, c_ld: null, c_lq: null, c_flw: null, c_fld: null,
      c_sw: null, c_sd: null, c_sq: null, c_fsw: null, c_fsd: null
    },
    MathLogic: {
      c_addi4spn: null, c_addi: null, c_addiw: null, c_addi16sp: null,
      c_li: null, c_lui: null, c_slli: null, c_srli: null, c_srai: null,
      c_andi: null, c_add: null, c_addw: null, c_sub: null, c_subw: null,
      c_and: null, c_or: null, c_xor: null
    },
    Control: {
      c_j: null, c_jal: null, c_jr: null, c_jalr: null,
      c_beqz: null, c_bnez: null
    },
    Misc: {
      c_mv: null, c_nop: null, c_ebreak: null
    }
  },
  // ==========================================
  // ARCHITECTURAL STATE
  // ==========================================
  State: {
    // ---------------------------------------------------------
    // The physical hardware arrays (32 registers each)
    // ---------------------------------------------------------
    x_ram: new BigUint64Array(32), // Integer Registers (64-bit)
    f_ram: new BigUint64Array(32),
    pc: 0n,            // Program Counter
    // Inside $.State:
    csr: new Map([
      // Floating Point
      [0x001, 0n], // fflags (Floating-Point Accrued Exceptions)
      [0x002, 0n], // frm (Floating-Point Dynamic Rounding Mode)
      [0x003, 0n], // fcsr (Floating-Point Control and Status)

      // Machine Information Registers (Typically Read-Only)
      [0xF11, 0n], // mvendorid (Vendor ID)
      [0xF12, 0n], // marchid (Architecture ID)
      [0xF13, 0n], // mimpid (Implementation ID)
      [0xF14, 0n], // mhartid (Hardware thread ID, usually 0 for single-core)

      // Machine Trap Setup
      [0x300, 0n], // mstatus (Machine status - globally enables/disables interrupts)
      [0x304, 0n], // mie (Machine interrupt enable - enables specific interrupts)
      [0x305, 0n], // mtvec (Machine trap-handler base vector)

      // Machine Trap Handling
      [0x340, 0n], // mscratch (Scratch register for OS context switching)
      [0x341, 0n], // mepc (Machine exception program counter - saves the PC)
      [0x342, 0n], // mcause (Machine trap cause)
      [0x343, 0n], // mtval (Machine bad address or instruction)
      [0x344, 0n]  // mip (Machine interrupt pending)
    ]),
    
    loadReservation: {
      active: false,
      address: 0n,
      size: 0
    },
    isWaitingOnReservation: false,
    // ---------------------------------------------------------
    // ABI Mapping (How compilers actually talk to registers)
    // ---------------------------------------------------------
    ABI: {
      // Hardware aliases
      zero: 0, ra: 1, sp: 2, gp: 3, tp: 4,
      // Temporaries
      t0: 5, t1: 6, t2: 7,
      // Saved Registers / Frame Pointer
      s0: 8, fp: 8, s1: 9,
      // Function Arguments / Return Values
      a0: 10, a1: 11, a2: 12, a3: 13, a4: 14, a5: 15, a6: 16, a7: 17,
      // More Saved Registers
      s2: 18, s3: 19, s4: 20, s5: 21, s6: 22, s7: 23, s8: 24, s9: 25, s10: 26, s11: 27,
      // More Temporaries
      t3: 28, t4: 29, t5: 30, t6: 31
    },
    F_ABI: {
      // Float Temporaries
      ft0: 0, ft1: 1, ft2: 2, ft3: 3, ft4: 4, ft5: 5, ft6: 6, ft7: 7,
      // Float Saved
      fs0: 8, fs1: 9,
      // Float Arguments
      fa0: 10, fa1: 11, fa2: 12, fa3: 13, fa4: 14, fa5: 15, fa6: 16, fa7: 17,
      // More Float Saved
      fs2: 18, fs3: 19, fs4: 20, fs5: 21, fs6: 22, fs7: 23, fs8: 24, fs9: 25, fs10: 26, fs11: 27,
      // More Float Temporaries
      ft8: 28, ft9: 29, ft10: 30, ft11: 31
    },

    get_rm: function(inst_rm) {
      // If instruction rm is 7 (0b111), use the dynamic rounding mode from FCSR
      if (inst_rm === 7) {
        let fcsr = $.State.csr.get(0x003) || 0n;
        let frm = Number((fcsr >> 5n) & 0x7n);
        if (frm > 4) throw new Error("Illegal instruction: Invalid dynamic rounding mode");
        return frm;
      }
      if (inst_rm > 4) throw new Error("Illegal instruction: Invalid static rounding mode");
      return inst_rm;
    },
    
    set_fflags: function(flags) {
      let fcsr = $.State.csr.get(0x003) || 0n;
      $.State.csr.set(0x003, fcsr | BigInt(flags));
    }
  }
};

let $ = RV64IMAFDGCCPU; // Shorthand for easier access in tests and implementation

$.ALU.Base = {
  // ==========================================
  // REGISTER-IMMEDIATE ARITHMETIC (I-Type)
  // ==========================================
 
  // Add Immediate: rs1 + imm
  addi: (rs1, imm) => BigInt.asIntN(64, rs1 + imm),
 
  // Set Less Than Immediate: 1 if rs1 < imm, else 0 (Signed)
  slti: (rs1, imm) => (rs1 < imm) ? 1n : 0n,
 
  // Set Less Than Immediate Unsigned
  sltiu: (rs1, imm) => (BigInt.asUintN(64, rs1) < BigInt.asUintN(64, imm)) ? 1n : 0n,
 
  // Logical XOR, OR, AND Immediate
  xori: (rs1, imm) => BigInt.asIntN(64, rs1 ^ imm),
  ori:  (rs1, imm) => BigInt.asIntN(64, rs1 | imm),
  andi: (rs1, imm) => BigInt.asIntN(64, rs1 & imm),


  // ==========================================
  // REGISTER-REGISTER ARITHMETIC (R-Type)
  // ==========================================
 
  // Add / Subtract
  add: (rs1, rs2) => BigInt.asIntN(64, rs1 + rs2),
  sub: (rs1, rs2) => BigInt.asIntN(64, rs1 - rs2),
 
  // Set Less Than (Signed / Unsigned)
  slt:  (rs1, rs2) => (rs1 < rs2) ? 1n : 0n,
  sltu: (rs1, rs2) => (BigInt.asUintN(64, rs1) < BigInt.asUintN(64, rs2)) ? 1n : 0n,
 
  // Logical XOR, OR, AND
  xor: (rs1, rs2) => BigInt.asIntN(64, rs1 ^ rs2),
  or:  (rs1, rs2) => BigInt.asIntN(64, rs1 | rs2),
  and: (rs1, rs2) => BigInt.asIntN(64, rs1 & rs2),


  // ==========================================
  // RV64 32-BIT WORD OPERATIONS
  // ==========================================
  // These compute on the lower 32 bits, and then the hardware
  // strictly sign-extends the result to 64 bits.
  // BigInt.asIntN(32, ...) handles this perfectly in one step!
 
  addiw: (rs1, imm) => BigInt.asIntN(32, rs1 + imm),
  addw:  (rs1, rs2) => BigInt.asIntN(32, rs1 + rs2),
  subw:  (rs1, rs2) => BigInt.asIntN(32, rs1 - rs2),


  // ==========================================
  // ADDRESSING
  // ==========================================
 
  // Load Upper Immediate: Places imm in top 20 bits of a 32-bit number, sign-extends.
  // Load Upper Immediate: The immediate is already shifted by the decoder.
  // We just need to sign-extend the 32-bit result to 64 bits.
  lui:   (imm) => BigInt.asIntN(32, imm),
  
  // Add Upper Immediate to PC: Sign-extend the 32-bit immediate and add to PC.
  auipc: (pc, imm) => pc + BigInt.asIntN(32, imm)
};
$.ALU.Shifts = {
  // ==========================================
  // 64-BIT SHIFTS
  // Shift amount is masked to the lower 6 bits (& 0x3Fn)
  // ==========================================
 
  // Shift Left Logical
  slli: (rs1, shamt) => BigInt.asIntN(64, rs1 << (shamt & 0x3Fn)),
  sll:  (rs1, rs2)   => BigInt.asIntN(64, rs1 << (rs2 & 0x3Fn)),
  // Shift Right Logical (Zeros shift in from the left)
  // We force rs1 to be Unsigned so JS doesn't drag the sign bit down.
  srli: (rs1, shamt) => BigInt.asIntN(64, BigInt.asUintN(64, rs1) >> (shamt & 0x3Fn)),
  srl:  (rs1, rs2)   => BigInt.asIntN(64, BigInt.asUintN(64, rs1) >> (rs2 & 0x3Fn)),
  // Shift Right Arithmetic (Sign bit copies itself inward)
  srai: (rs1, shamt) => BigInt.asIntN(64, rs1 >> (shamt & 0x3Fn)),
  sra:  (rs1, rs2)   => BigInt.asIntN(64, rs1 >> (rs2 & 0x3Fn)),


  // ==========================================
  // 32-BIT WORD SHIFTS (RV64 Specific)
  // Shift amount is masked to the lower 5 bits (& 0x1Fn)
  // Operates on 32-bits, then sign-extends to 64-bits
  // ==========================================
  // Word Shift Left Logical
  slliw: (rs1, shamt) => BigInt.asIntN(32, rs1 << (shamt & 0x1Fn)),
  sllw:  (rs1, rs2)   => BigInt.asIntN(32, rs1 << (rs2 & 0x1Fn)),
  // Word Shift Right Logical
  srliw: (rs1, shamt) => BigInt.asIntN(32, BigInt.asUintN(32, rs1) >> (shamt & 0x1Fn)),
  srlw:  (rs1, rs2)   => BigInt.asIntN(32, BigInt.asUintN(32, rs1) >> (rs2 & 0x1Fn)),
  // Word Shift Right Arithmetic
  // We force rs1 to 32-bit signed so the 32nd bit acts as the sign bit during the shift.
  sraiw: (rs1, shamt) => BigInt.asIntN(32, BigInt.asIntN(32, rs1) >> (shamt & 0x1Fn)),
  sraw:  (rs1, rs2)   => BigInt.asIntN(32, BigInt.asIntN(32, rs1) >> (rs2 & 0x1Fn))
};

$.ALU.Jumps = {
  // ==========================================
  // UNCONDITIONAL JUMPS
  // These return an object containing the new PC value
  // and the return address to be saved in the 'rd' register.
  // ==========================================
  // Jump and Link: Target is PC + immediate.
  jal: (pc, imm) => ({
    rd_val: pc + 4n, // The return address (the instruction after the jump)
    new_pc: BigInt.asIntN(64, pc + imm)
  }),
  // Jump and Link Register: Target is rs1 + immediate.
  // RISC-V hardware specifically sets the least-significant bit to 0 for JALR.
  // We use `& ~1n` (bitwise AND with everything-but-the-last-bit) to force it to 0.
  jalr: (pc, rs1, imm) => ({
    rd_val: pc + 4n,
    new_pc: BigInt.asIntN(64, (rs1 + imm) & ~1n)
  })
};
$.ALU.Branches = {
  // ==========================================
  // CONDITIONAL BRANCHES
  // The ALU's job here is just to compare the registers and
  // return a boolean (true if branch taken, false if not).
  // The CPU will then do: if (taken) PC = PC + imm; else PC = PC + 4;
  // ==========================================
  // Equality
  beq: (rs1, rs2) => rs1 === rs2,
  bne: (rs1, rs2) => rs1 !== rs2,
  // Signed Comparisons (BigInt handles the sign naturally here)
  blt: (rs1, rs2) => rs1 < rs2,
  bge: (rs1, rs2) => rs1 >= rs2,
  // Unsigned Comparisons (We must force them to 64-bit Unsigned first)
  bltu: (rs1, rs2) => BigInt.asUintN(64, rs1) < BigInt.asUintN(64, rs2),
  bgeu: (rs1, rs2) => BigInt.asUintN(64, rs1) >= BigInt.asUintN(64, rs2)
};
$.ALU.M = {
  // ==========================================
  // 64-BIT MULTIPLICATION
  // mulh, mulhu, and mulhsu return the UPPER 64 bits of a 128-bit product.
  // Because BigInt scales automatically, we just multiply and shift right by 64.
  // ==========================================
  // Lower 64 bits (Signed/Unsigned agnostic)
  mul: (rs1, rs2) => BigInt.asIntN(64, rs1 * rs2),
  // Upper 64 bits (Signed x Signed)
  mulh: (rs1, rs2) => BigInt.asIntN(64, (rs1 * rs2) >> 64n),
  // Upper 64 bits (Signed rs1 x Unsigned rs2)
  mulhsu: (rs1, rs2) => {
    let u_rs2 = BigInt.asUintN(64, rs2);
    return BigInt.asIntN(64, (rs1 * u_rs2) >> 64n);
  },
  // Upper 64 bits (Unsigned x Unsigned)
  mulhu: (rs1, rs2) => {
    let u_rs1 = BigInt.asUintN(64, rs1);
    let u_rs2 = BigInt.asUintN(64, rs2);
    return BigInt.asIntN(64, (u_rs1 * u_rs2) >> 64n);
  },


  // ==========================================
  // 64-BIT DIVISION & REMAINDER
  // Must explicitly handle RISC-V zero and overflow rules.
  // MIN_INT64 is -9223372036854775808n
  // ==========================================
  div: (rs1, rs2) => {
    if (rs2 === 0n) return -1n;
    if (rs1 === -9223372036854775808n && rs2 === -1n) return rs1;
    return BigInt.asIntN(64, rs1 / rs2);
  },
  divu: (rs1, rs2) => {
    let u_rs1 = BigInt.asUintN(64, rs1), u_rs2 = BigInt.asUintN(64, rs2);
    if (u_rs2 === 0n) return -1n;
    return BigInt.asIntN(64, u_rs1 / u_rs2);
  },
  rem: (rs1, rs2) => {
    if (rs2 === 0n) return rs1;
    if (rs1 === -9223372036854775808n && rs2 === -1n) return 0n;
    return BigInt.asIntN(64, rs1 % rs2);
  },
  remu: (rs1, rs2) => {
    let u_rs1 = BigInt.asUintN(64, rs1), u_rs2 = BigInt.asUintN(64, rs2);
    if (u_rs2 === 0n) return rs1;
    return BigInt.asIntN(64, u_rs1 % u_rs2);
  },


  // ==========================================
  // 32-BIT WORD MULTIPLICATION & DIVISION (RV64)
  // Operates on 32-bits, then sign-extends to 64-bits
  // MIN_INT32 is -2147483648n
  // ==========================================
  mulw: (rs1, rs2) => BigInt.asIntN(32, rs1 * rs2),
  divw: (rs1, rs2) => {
    let s1 = BigInt.asIntN(32, rs1), s2 = BigInt.asIntN(32, rs2);
    if (s2 === 0n) return -1n;
    if (s1 === -2147483648n && s2 === -1n) return s1;
    return BigInt.asIntN(32, s1 / s2);
  },
  divuw: (rs1, rs2) => {
    let u1 = BigInt.asUintN(32, rs1), u2 = BigInt.asUintN(32, rs2);
    if (u2 === 0n) return -1n;
    // The spec requires sign-extending the 32-bit unsigned result!
    return BigInt.asIntN(32, u1 / u2);
  },
  remw: (rs1, rs2) => {
    let s1 = BigInt.asIntN(32, rs1), s2 = BigInt.asIntN(32, rs2);
    if (s2 === 0n) return s1;
    if (s1 === -2147483648n && s2 === -1n) return 0n;
    return BigInt.asIntN(32, s1 % s2);
  },
  remuw: (rs1, rs2) => {
    let u1 = BigInt.asUintN(32, rs1), u2 = BigInt.asUintN(32, rs2);
    if (u2 === 0n) return BigInt.asIntN(32, u1);
    return BigInt.asIntN(32, u1 % u2);
  }
};
$.LSU.Base = {
  // ==========================================
  // LOADS (I-Type)
  // Calculates: Address = rs1 + imm
  // Returns: The address, how many bytes to read, and if it needs sign-extension.
  // ==========================================
  // Load Byte, Halfword, Word, Doubleword (Signed)
  lb: (rs1, imm) => ({ addr: BigInt.asUintN(64, rs1 + imm), bytes: 1, signed: true }),
  lh: (rs1, imm) => ({ addr: BigInt.asUintN(64, rs1 + imm), bytes: 2, signed: true }),
  lw: (rs1, imm) => ({ addr: BigInt.asUintN(64, rs1 + imm), bytes: 4, signed: true }),
  ld: (rs1, imm) => ({ addr: BigInt.asUintN(64, rs1 + imm), bytes: 8, signed: true }),
  // Load Byte, Halfword, Word (Unsigned)
  // (Note: No 'ldu' because a 64-bit load fills the entire 64-bit register anyway)
  lbu: (rs1, imm) => ({ addr: BigInt.asUintN(64, rs1 + imm), bytes: 1, signed: false }),
  lhu: (rs1, imm) => ({ addr: BigInt.asUintN(64, rs1 + imm), bytes: 2, signed: false }),
  lwu: (rs1, imm) => ({ addr: BigInt.asUintN(64, rs1 + imm), bytes: 4, signed: false }),


  // ==========================================
  // STORES (S-Type)
  // Calculates: Address = rs1 + imm
  // Returns: The address, how many bytes to write, and the cleanly masked value.
  // ==========================================
  // Store Byte, Halfword, Word, Doubleword
  // We use BigInt.asUintN to chop off the higher bits of rs2, making your
  // memory controller's job infinitely easier down the line!
  sb: (rs1, rs2, imm) => ({
    addr: BigInt.asUintN(64, rs1 + imm),
    bytes: 1,
    value: BigInt.asUintN(8, rs2)
  }),
 
  sh: (rs1, rs2, imm) => ({
    addr: BigInt.asUintN(64, rs1 + imm),
    bytes: 2,
    value: BigInt.asUintN(16, rs2)
  }),
 
  sw: (rs1, rs2, imm) => ({
    addr: BigInt.asUintN(64, rs1 + imm),
    bytes: 4,
    value: BigInt.asUintN(32, rs2)
  }),
 
  sd: (rs1, rs2, imm) => ({
    addr: BigInt.asUintN(64, rs1 + imm),
    bytes: 8,
    value: BigInt.asUintN(64, rs2)
  })
};
function checkAligned(addr, bytes) {
  if (addr % BigInt(bytes) !== 0n) {
    // For Atomics, Load-Reserved, and Store-Conditional, a misaligned 
    // address triggers a Store/AMO Address Misaligned exception.
    $.System.Trap.trigger(
      $.System.Trap.Exceptions.StoreAMOAddrMisaligned, 
      $.State.pc, 
      addr
    );
    // Throwing a JS error here stops the rest of the instruction execution
    // so it doesn't try to access memory after trapping.
    throw new Error("Trap: Store/AMO Address Misaligned"); 
  }
}

$.LSU.A = {
  // ==========================================
  // LOAD RESERVED & STORE CONDITIONAL
  // ==========================================
  lr_w: (rs1) => {
    checkAligned(rs1, 4);
    return { type: 'LR', addr: rs1, bytes: 4, signed: true };
  },
  lr_d: (rs1) => {
    checkAligned(rs1, 8);
    return { type: 'LR', addr: rs1, bytes: 8, signed: true };
  },
  sc_w: (rs1, rs2) => {
    checkAligned(rs1, 4);
    return { type: 'SC', addr: rs1, bytes: 4, value: BigInt.asUintN(32, rs2) };
  },
  sc_d: (rs1, rs2) => {
    checkAligned(rs1, 8);
    return { type: 'SC', addr: rs1, bytes: 8, value: BigInt.asUintN(64, rs2) };
  },
  // ==========================================
  // ZACAS: ATOMIC COMPARE-AND-SWAP
  // Note: Requires passing the current value of 'rd' as an argument!
  // ==========================================
  amocas_w: (rs1, rs2, rd_val) => {
    checkAligned(rs1, 4);
    return { type: 'AMO', addr: rs1, bytes: 4, signed: true, op: (mem) => {
      let m = BigInt.asUintN(32, mem);
      let r = BigInt.asUintN(32, rd_val);
      return (m === r) ? BigInt.asUintN(32, rs2) : m;
    }};
  },
  amocas_d: (rs1, rs2, rd_val) => {
    checkAligned(rs1, 8);
    return { type: 'AMO', addr: rs1, bytes: 8, signed: true, op: (mem) => {
      let m = BigInt.asUintN(64, mem);
      let r = BigInt.asUintN(64, rd_val);
      return (m === r) ? BigInt.asUintN(64, rs2) : m;
    }};
  },
  // ==========================================
  // ZABHA: BYTE ATOMICS (.b)
  // Operates on 8-bit values, sign-extends result to 64-bits
  // ==========================================
  amoswap_b: (rs1, rs2) => ({ type: 'AMO', addr: rs1, bytes: 1, signed: true, op: (mem) => BigInt.asUintN(8, rs2) }),
  amoadd_b:  (rs1, rs2) => ({ type: 'AMO', addr: rs1, bytes: 1, signed: true, op: (mem) => BigInt.asIntN(8, mem + rs2) }),
  amoxor_b:  (rs1, rs2) => ({ type: 'AMO', addr: rs1, bytes: 1, signed: true, op: (mem) => BigInt.asIntN(8, mem ^ rs2) }),
  amoand_b:  (rs1, rs2) => ({ type: 'AMO', addr: rs1, bytes: 1, signed: true, op: (mem) => BigInt.asIntN(8, mem & rs2) }),
  amoor_b:   (rs1, rs2) => ({ type: 'AMO', addr: rs1, bytes: 1, signed: true, op: (mem) => BigInt.asIntN(8, mem | rs2) }),
  amomin_b:  (rs1, rs2) => ({ type: 'AMO', addr: rs1, bytes: 1, signed: true, op: (mem) => (BigInt.asIntN(8, mem) < BigInt.asIntN(8, rs2)) ? mem : rs2 }),
  amomax_b:  (rs1, rs2) => ({ type: 'AMO', addr: rs1, bytes: 1, signed: true, op: (mem) => (BigInt.asIntN(8, mem) > BigInt.asIntN(8, rs2)) ? mem : rs2 }),
  amominu_b: (rs1, rs2) => ({ type: 'AMO', addr: rs1, bytes: 1, signed: true, op: (mem) => (BigInt.asUintN(8, mem) < BigInt.asUintN(8, rs2)) ? mem : rs2 }),
  amomaxu_b: (rs1, rs2) => ({ type: 'AMO', addr: rs1, bytes: 1, signed: true, op: (mem) => (BigInt.asUintN(8, mem) > BigInt.asUintN(8, rs2)) ? mem : rs2 }),
  // ==========================================
  // ZABHA: HALFWORD ATOMICS (.h)
  // Operates on 16-bit values, sign-extends result to 64-bits
  // ==========================================
  amoswap_h: (rs1, rs2) => { checkAligned(rs1, 2); return { type: 'AMO', addr: rs1, bytes: 2, signed: true, op: (mem) => BigInt.asUintN(16, rs2) }; },
  amoadd_h:  (rs1, rs2) => { checkAligned(rs1, 2); return { type: 'AMO', addr: rs1, bytes: 2, signed: true, op: (mem) => BigInt.asIntN(16, mem + rs2) }; },
  amoxor_h:  (rs1, rs2) => { checkAligned(rs1, 2); return { type: 'AMO', addr: rs1, bytes: 2, signed: true, op: (mem) => BigInt.asIntN(16, mem ^ rs2) }; },
  amoand_h:  (rs1, rs2) => { checkAligned(rs1, 2); return { type: 'AMO', addr: rs1, bytes: 2, signed: true, op: (mem) => BigInt.asIntN(16, mem & rs2) }; },
  amoor_h:   (rs1, rs2) => { checkAligned(rs1, 2); return { type: 'AMO', addr: rs1, bytes: 2, signed: true, op: (mem) => BigInt.asIntN(16, mem | rs2) }; },
  amomin_h:  (rs1, rs2) => { checkAligned(rs1, 2); return { type: 'AMO', addr: rs1, bytes: 2, signed: true, op: (mem) => (BigInt.asIntN(16, mem) < BigInt.asIntN(16, rs2)) ? mem : rs2 }; },
  amomax_h:  (rs1, rs2) => { checkAligned(rs1, 2); return { type: 'AMO', addr: rs1, bytes: 2, signed: true, op: (mem) => (BigInt.asIntN(16, mem) > BigInt.asIntN(16, rs2)) ? mem : rs2 }; },
  amominu_h: (rs1, rs2) => { checkAligned(rs1, 2); return { type: 'AMO', addr: rs1, bytes: 2, signed: true, op: (mem) => (BigInt.asUintN(16, mem) < BigInt.asUintN(16, rs2)) ? mem : rs2 }; },
  amomaxu_h: (rs1, rs2) => { checkAligned(rs1, 2); return { type: 'AMO', addr: rs1, bytes: 2, signed: true, op: (mem) => (BigInt.asUintN(16, mem) > BigInt.asUintN(16, rs2)) ? mem : rs2 }; },
  // ==========================================
  // WORD ATOMICS (.w)
  // ==========================================
  amoswap_w: (rs1, rs2) => { checkAligned(rs1, 4); return { type: 'AMO', addr: rs1, bytes: 4, signed: true, op: (mem) => BigInt.asUintN(32, rs2) }; },
  amoadd_w:  (rs1, rs2) => { checkAligned(rs1, 4); return { type: 'AMO', addr: rs1, bytes: 4, signed: true, op: (mem) => BigInt.asIntN(32, mem + rs2) }; },
  amoxor_w:  (rs1, rs2) => { checkAligned(rs1, 4); return { type: 'AMO', addr: rs1, bytes: 4, signed: true, op: (mem) => BigInt.asIntN(32, mem ^ rs2) }; },
  amoand_w:  (rs1, rs2) => { checkAligned(rs1, 4); return { type: 'AMO', addr: rs1, bytes: 4, signed: true, op: (mem) => BigInt.asIntN(32, mem & rs2) }; },
  amoor_w:   (rs1, rs2) => { checkAligned(rs1, 4); return { type: 'AMO', addr: rs1, bytes: 4, signed: true, op: (mem) => BigInt.asIntN(32, mem | rs2) }; },
  amomin_w:  (rs1, rs2) => { checkAligned(rs1, 4); return { type: 'AMO', addr: rs1, bytes: 4, signed: true, op: (mem) => (BigInt.asIntN(32, mem) < BigInt.asIntN(32, rs2)) ? mem : rs2 }; },
  amomax_w:  (rs1, rs2) => { checkAligned(rs1, 4); return { type: 'AMO', addr: rs1, bytes: 4, signed: true, op: (mem) => (BigInt.asIntN(32, mem) > BigInt.asIntN(32, rs2)) ? mem : rs2 }; },
  amominu_w: (rs1, rs2) => { checkAligned(rs1, 4); return { type: 'AMO', addr: rs1, bytes: 4, signed: true, op: (mem) => (BigInt.asUintN(32, mem) < BigInt.asUintN(32, rs2)) ? mem : rs2 }; },
  amomaxu_w: (rs1, rs2) => { checkAligned(rs1, 4); return { type: 'AMO', addr: rs1, bytes: 4, signed: true, op: (mem) => (BigInt.asUintN(32, mem) > BigInt.asUintN(32, rs2)) ? mem : rs2 }; },
  // ==========================================
  // DOUBLEWORD ATOMICS (.d)
  // ==========================================
  amoswap_d: (rs1, rs2) => { checkAligned(rs1, 8); return { type: 'AMO', addr: rs1, bytes: 8, signed: true, op: (mem) => BigInt.asUintN(64, rs2) }; },
  amoadd_d:  (rs1, rs2) => { checkAligned(rs1, 8); return { type: 'AMO', addr: rs1, bytes: 8, signed: true, op: (mem) => BigInt.asIntN(64, mem + rs2) }; },
  amoxor_d:  (rs1, rs2) => { checkAligned(rs1, 8); return { type: 'AMO', addr: rs1, bytes: 8, signed: true, op: (mem) => BigInt.asIntN(64, mem ^ rs2) }; },
  amoand_d:  (rs1, rs2) => { checkAligned(rs1, 8); return { type: 'AMO', addr: rs1, bytes: 8, signed: true, op: (mem) => BigInt.asIntN(64, mem & rs2) }; },
  amoor_d:   (rs1, rs2) => { checkAligned(rs1, 8); return { type: 'AMO', addr: rs1, bytes: 8, signed: true, op: (mem) => BigInt.asIntN(64, mem | rs2) }; },
  amomin_d:  (rs1, rs2) => { checkAligned(rs1, 8); return { type: 'AMO', addr: rs1, bytes: 8, signed: true, op: (mem) => (BigInt.asIntN(64, mem) < BigInt.asIntN(64, rs2)) ? mem : rs2 }; },
  amomax_d:  (rs1, rs2) => { checkAligned(rs1, 8); return { type: 'AMO', addr: rs1, bytes: 8, signed: true, op: (mem) => (BigInt.asIntN(64, mem) > BigInt.asIntN(64, rs2)) ? mem : rs2 }; },
  amominu_d: (rs1, rs2) => { checkAligned(rs1, 8); return { type: 'AMO', addr: rs1, bytes: 8, signed: true, op: (mem) => (BigInt.asUintN(64, mem) < BigInt.asUintN(64, rs2)) ? mem : rs2 }; },
  amomaxu_d: (rs1, rs2) => { checkAligned(rs1, 8); return { type: 'AMO', addr: rs1, bytes: 8, signed: true, op: (mem) => (BigInt.asUintN(64, mem) > BigInt.asUintN(64, rs2)) ? mem : rs2 }; }
};
// Performs infinitely precise IEEE-754 32-bit FMA matching SoftFloat
function exact_f32_mulAdd(uiA, uiB, uiC, op) {
    // Force inputs to 32-bit unsigned integers
    uiA = Number(BigInt(uiA) & 0xFFFFFFFFn) >>> 0;
    uiB = Number(BigInt(uiB) & 0xFFFFFFFFn) >>> 0;
    uiC = Number(BigInt(uiC) & 0xFFFFFFFFn) >>> 0;
    // Helper to unpack F32 into exact integer mantissa and shifted exponent
    function unpackF32(ui) {
        let sign = (ui >>> 31) === 1 ? -1 : 1;
        let e = (ui >>> 23) & 0xFF;
        let f = ui & 0x7FFFFF;
       
        if (e === 0xFF) return { sign, mant: 0n, exp: 0, isNaN: f !== 0, isInf: f === 0, isZero: false };
        if (e === 0) {
            if (f === 0) return { sign, mant: 0n, exp: 0, isNaN: false, isInf: false, isZero: true };
            // Subnormal: No hidden bit, exponent is locked to -126
            return { sign, mant: BigInt(f), exp: -126 - 23, isNaN: false, isInf: false, isZero: false };
        }
        // Normal: Add hidden bit (0x800000)
        return { sign, mant: BigInt(f | 0x800000), exp: e - 127 - 23, isNaN: false, isInf: false, isZero: false };
    }
    const A = unpackF32(uiA);
    const B = unpackF32(uiB);
    const C = unpackF32(uiC);
    // op: 0 = fmadd, 1 = fmsubC, 2 = fnmsubProd, 3 = fnmadd
    let sProd = A.sign * B.sign * ((op === 2 || op === 3) ? -1 : 1);
    let sC = C.sign * ((op === 1 || op === 3) ? -1 : 1);
    const defaultNaN = 0x7FC00000; // RISC-V Canonical NaN
    // --- Special Cases ---
    if (A.isNaN || B.isNaN || C.isNaN) return defaultNaN;
    if ((A.isInf && B.isZero) || (A.isZero && B.isInf)) return defaultNaN;
   
    let prodIsInf = A.isInf || B.isInf;
    if (prodIsInf) {
        if (C.isInf && sProd !== sC) return defaultNaN; // Inf - Inf
        return sProd === -1 ? 0xFF800000 : 0x7F800000;
    }
    if (C.isInf) return sC === -1 ? 0xFF800000 : 0x7F800000;
    let prodIsZero = A.isZero || B.isZero;
    if (prodIsZero && C.isZero) {
        if (sProd === sC) return sProd === -1 ? 0x80000000 : 0x00000000;
        return 0x00000000; // IEEE 754: x + (-x) = +0 for round-to-nearest
    }
    // --- Infinite Precision Arithmetic ---
    let M_prod = prodIsZero ? 0n : A.mant * B.mant;
    let P_prod = A.exp + B.exp;
    let M_C = C.isZero ? 0n : C.mant;
    let P_C = C.exp;
   
    // Align mantissas to the lowest exponent
    let P_res = Math.min(P_prod, P_C);
    if (!prodIsZero && P_prod > P_res) M_prod <<= BigInt(P_prod - P_res);
    if (!C.isZero && P_C > P_res) M_C <<= BigInt(P_C - P_res);
    let val_prod = sProd === -1 ? -M_prod : M_prod;
    let val_C = sC === -1 ? -M_C : M_C;
    let res_mant = val_prod + val_C;
    if (res_mant === 0n) return 0x00000000;
    let res_sign = 1;
    if (res_mant < 0n) {
        res_sign = -1;
        res_mant = -res_mant; // abs
    }
    // --- Normalization & Rounding ---
    let mant_len = res_mant.toString(2).length;
    let shift = mant_len - 24; // Target is exactly 24 bits
    let final_exp = P_res + shift;
    let stored_e = final_exp + 23 + 127;
   
    let sticky = 0n;
    let round_bit = 0n;
    let sig = res_mant;
   
    if (shift > 0) {
        let shift_n = BigInt(shift);
        let mask = (1n << shift_n) - 1n;
        let discarded = res_mant & mask;
        round_bit = (discarded >> (shift_n - 1n)) & 1n;
        sticky = (discarded & ((1n << (shift_n - 1n)) - 1n)) !== 0n ? 1n : 0n;
        sig = res_mant >> shift_n;
    } else if (shift < 0) {
        sig = res_mant << BigInt(-shift);
    }
    // Handle Subnormals / Underflow
    if (stored_e <= 0) {
        let sub_shift = 1 - stored_e;
        let shift_n = BigInt(sub_shift);
       
        if (shift_n >= 26n) {
            sig = 0n;
            round_bit = 0n;
            sticky = 1n; // Flushed
        } else {
            let mask = (1n << shift_n) - 1n;
            let discarded = sig & mask;
            let new_round = (discarded >> (shift_n - 1n)) & 1n;
            let new_sticky = (discarded & ((1n << (shift_n - 1n)) - 1n)) !== 0n ? 1n : 0n;
           
            // Carry over previous sticky bits
            if (round_bit === 1n || sticky === 1n) new_sticky = 1n;
           
            sig >>= shift_n;
            round_bit = new_round;
            sticky = new_sticky;
        }
        stored_e = 0;
    } else if (stored_e >= 0xFF) {
        return (res_sign === -1 ? 0x80000000 : 0) | 0x7F800000; // Overflow to Inf
    }
    // Round to Nearest, Ties to Even
    // --- IEEE 754 Universal Rounding ---
    let do_increment = false;
    let is_neg = (res_sign === -1);

    switch (rm) {
      case 0: // RNE (Round to Nearest, ties to Even)
            if (round_bit === 1n && (sticky === 1n || (sig & 1n) === 1n)) do_increment = true;
            break;
        case 1: // RTZ (Round towards Zero)
            do_increment = false; // Just truncate
            break;
        case 2: // RDN (Round Down, towards -Infinity)
            if (is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true;
            break;
        case 3: // RUP (Round Up, towards +Infinity)
            if (!is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true;
            break;
        case 4: // RMM (Round to Nearest, ties to Max Magnitude)
            if (round_bit === 1n) do_increment = true;
            break;
        default:
            throw new Error("Invalid rounding mode: " + rm);
    }

    if (do_increment) {
        sig += 1n;
    }
   
    // Post-rounding Overflow check
    if (sig === 0x1000000n) {
        sig >>= 1n;
        stored_e += 1;
        if (stored_e === 0xFF) return (res_sign === -1 ? 0x80000000 : 0) | 0x7F800000;
    } else if (stored_e === 0 && sig === 0x800000n) {
        stored_e = 1; // Subnormal rounded up to lowest normal
    }
    // --- Pack IEEE 754 ---
    let f = Number(sig) & 0x7FFFFF;
    let final_ui = (res_sign === -1 ? 0x80000000 : 0) | (stored_e << 23) | f;
   
    return final_ui >>> 0;
}
function exact_f32_add(uiA, uiB, rm) {
  return exact_f32_mulAdd(uiA, 0x3F800000, uiB, 0, rm);
}

function exact_f32_sub(uiA, uiB, rm) {
  return exact_f32_mulAdd(uiA, 0x3F800000, uiB, 1, rm);
}

function exact_f32_mul(uiA, uiB, rm) {
  return exact_f32_mulAdd(uiA, uiB, 0x00000000, 0, rm);
}

// ============================================================================
// 4. DIVISION
// FMA cannot do division, so we emulate SoftFloat's f32_div directly using BigInt
// ============================================================================
function exact_f32_div(uiA, uiB, rm) {
  uiA = Number(BigInt(uiA) & 0xFFFFFFFFn) >>> 0;
  uiB = Number(BigInt(uiB) & 0xFFFFFFFFn) >>> 0;

  let signA = (uiA >>> 31) & 1;
  let expA = (uiA >>> 23) & 0xFF;
  let sigA = uiA & 0x7FFFFF;

  let signB = (uiB >>> 31) & 1;
  let expB = (uiB >>> 23) & 0xFF;
  let sigB = uiB & 0x7FFFFF;

  let signZ = signA ^ signB;
  const defaultNaN = 0x7FC00000;

  // --- NaNs and Infinities ---
  if (expA === 0xFF) {
      if (sigA !== 0) return defaultNaN; // A is NaN
      if (expB === 0xFF) {
          if (sigB !== 0) return defaultNaN; // B is NaN
          return defaultNaN; // Inf / Inf
      }
      return (signZ << 31) | 0x7F800000; // Inf / Normal = Inf
  }
  if (expB === 0xFF) {
      if (sigB !== 0) return defaultNaN; // B is NaN
      return (signZ << 31) >>> 0; // Normal / Inf = 0
  }

  // --- Zeros and Subnormals ---
  if (expB === 0) {
      if (sigB === 0) {
          if (expA === 0 && sigA === 0) return defaultNaN; // 0 / 0
          return (signZ << 31) | 0x7F800000; // Normal / 0 = Inf
      }
      // Normalize Subnormal B
      while ((sigB & 0x800000) === 0) { sigB <<= 1; expB--; }
      sigB &= 0x7FFFFF;
  }
  if (expA === 0) {
      if (sigA === 0) return (signZ << 31) >>> 0; // 0 / Normal = 0
      // Normalize Subnormal A
      while ((sigA & 0x800000) === 0) { sigA <<= 1; expA--; }
      sigA &= 0x7FFFFF;
  }

  // --- Infinite Precision Division ---
  let expZ = expA - expB + 126;
  let mantA = BigInt(sigA | 0x800000);
  let mantB = BigInt(sigB | 0x800000);

  // Shift A way up so we have plenty of fractional bits for division
  // We need 24 bits for the mantissa + 2 for rounding/sticky = 26 bits
  if (mantA < mantB) {
      expZ--;
      mantA <<= 26n;
  } else {
      mantA <<= 25n;
  }

  let sigZ = mantA / mantB;
  let remainder = mantA % mantB;

  let sticky = remainder !== 0n ? 1n : 0n;
  let round_bit = sigZ & 1n;
  sigZ >>= 1n; // Shift out the round bit to get exactly 24 bits

  // --- Subnormal Result Handling ---
  if (expZ <= 0) {
      let shift = 1 - expZ;
      if (shift > 25) {
          sigZ = 0n;
          round_bit = 0n;
          sticky = 1n;
      } else {
          let shift_n = BigInt(shift);
          let mask = (1n << shift_n) - 1n;
          let discarded = sigZ & mask;
          
          let new_round = (discarded >> (shift_n - 1n)) & 1n;
          let new_sticky = ((discarded & ((1n << (shift_n - 1n)) - 1n)) !== 0n || round_bit === 1n || sticky === 1n) ? 1n : 0n;
          
          sigZ >>= shift_n;
          round_bit = new_round;
          sticky = new_sticky;
      }
      expZ = 0;
  }

  // --- IEEE 754 Universal Rounding ---
  let do_increment = false;
  let is_neg = (signZ === 1);

  switch (rm) {
      case 0: // RNE (Round to Nearest, ties to Even)
          if (round_bit === 1n && (sticky === 1n || (sigZ & 1n) === 1n)) do_increment = true;
          break;
      case 1: // RTZ (Round towards Zero)
          do_increment = false; // Just truncate
          break;
      case 2: // RDN (Round Down, towards -Infinity)
          if (is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true;
          break;
      case 3: // RUP (Round Up, towards +Infinity)
          if (!is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true;
          break;
      case 4: // RMM (Round to Nearest, ties to Max Magnitude)
          if (round_bit === 1n) do_increment = true;
          break;
      default:
          throw new Error("Invalid rounding mode: " + rm);
  }

  if (do_increment) {
      sigZ += 1n;
  }

  // --- Overflow Check Post-Rounding ---
  if (sigZ >= 0x1000000n) {
      sigZ >>= 1n;
      expZ++;
  } else if (expZ === 0 && sigZ >= 0x800000n) {
      expZ = 1;
  }

  if (expZ >= 0xFF) {
      return ((signZ << 31) | 0x7F800000) >>> 0; // Overflow to Infinity
  }

  // --- Pack Final Result ---
  let f = Number(sigZ) & 0x7FFFFF;
  let final_ui = (signZ << 31) | (expZ << 23) | f;
  return final_ui >>> 0;
}

// ============================================================================
// 5. SQUARE ROOT
// ============================================================================
// ============================================================================
// 5. EXACT SQUARE ROOT (WITH UNIVERSAL ROUNDING MODES)
// ============================================================================
function exact_f32_sqrt(uiA, rm) {
  uiA = Number(BigInt(uiA) & 0xFFFFFFFFn) >>> 0;

  let signA = (uiA >>> 31) & 1;
  let expA = (uiA >>> 23) & 0xFF;
  let sigA = uiA & 0x7FFFFF;

  const defaultNaN = 0x7FC00000;

  // --- 1. Special Cases (Matches SoftFloat) ---
  if (expA === 0xFF) {
      if (sigA !== 0) return defaultNaN;  // NaN -> NaN
      if (signA === 1) return defaultNaN; // -Inf -> NaN
      return uiA;                         // +Inf -> +Inf
  }
  if (signA === 1) {
      if (expA === 0 && sigA === 0) return 0x80000000; // -0.0 -> -0.0
      return defaultNaN; // All other Negative Numbers -> NaN
  }
  if (expA === 0 && sigA === 0) return 0x00000000; // +0.0 -> +0.0

  // --- 2. Normalize Subnormals ---
  let actual_exp = expA === 0 ? -126 : expA - 127;
  if (expA === 0) {
      while ((sigA & 0x800000) === 0) {
          sigA <<= 1;
          actual_exp--;
      }
  }

  // --- 3. Align for Integer Square Root ---
  // We align the mantissa so our result gives us ~26 bits (24 for mantissa + round + sticky).
  let P = actual_exp - 23;
  
  // To preserve exponent parity, we shift by an even amount (28) if P is even, 
  // or an odd amount (29) if P is odd.
  let shift_M = (P % 2 !== 0) ? 29n : 28n;
  
  let M = BigInt(sigA | 0x800000); // Attach the hidden bit
  let M_shifted = M << shift_M;    // Value is now max ~2^53
  
  // --- 4. Exact Integer Square Root ---
  // Because M_shifted is at most 53 bits, `Number(M_shifted)` loses ZERO precision.
  // Math.sqrt() perfectly evaluates the exact integer root.
  let Z = BigInt(Math.floor(Math.sqrt(Number(M_shifted))));
  
  // Bounds check just in case float limits got brushed:
  while (Z * Z > M_shifted) Z--;
  while ((Z + 1n) * (Z + 1n) <= M_shifted) Z++;

  // --- 5. Remainder & Sticky Bit ---
  let remainder = M_shifted - Z * Z;
  let sticky = remainder !== 0n ? 1n : 0n;

  // --- 6. Shift down to exactly 24 bits ---
  // Z will be 26 bits if shifted by 28, or 27 bits if shifted by 29.
  let shift_n = (Z >> 26n) !== 0n ? 3n : 2n;
  
  let mask = (1n << shift_n) - 1n;
  let discarded = Z & mask;
  let round_bit = (discarded >> (shift_n - 1n)) & 1n;
  let new_sticky = ((discarded & ((1n << (shift_n - 1n)) - 1n)) !== 0n || sticky === 1n) ? 1n : 0n;
  
  let sigZ = Z >> shift_n;
  
  // The new exponent is halved (square root halves exponents)
  let expZ = Math.floor(actual_exp / 2) + 127;

  // --- 7. IEEE 754 Universal Rounding ---
  let do_increment = false;
  
  switch (rm) {
      case 0: // RNE (Round to Nearest, ties to Even)
          if (round_bit === 1n && (new_sticky === 1n || (sigZ & 1n) === 1n)) do_increment = true;
          break;
      case 1: // RTZ (Round towards Zero)
          do_increment = false; 
          break;
      case 2: // RDN (Round Down, towards -Infinity)
          do_increment = false; // Square roots are ALWAYS positive
          break;
      case 3: // RUP (Round Up, towards +Infinity)
          if (round_bit === 1n || new_sticky === 1n) do_increment = true;
          break;
      case 4: // RMM (Round to Nearest, ties to Max Magnitude)
          if (round_bit === 1n) do_increment = true;
          break;
      default:
          throw new Error("Invalid rounding mode: " + rm);
  }
  
  if (do_increment) {
      sigZ += 1n;
      // If we carry over and overflow the 24-bit mantissa (e.g. 1.1111... -> 2.0)
      if (sigZ >= 0x1000000n) {
          sigZ >>= 1n;
          expZ++;
      }
  }

  // Note: Square root cannot possibly underflow to a subnormal!
  // Smallest subnormal float is 2^-149. Sqrt(2^-149) is ~ 2^-75, which is highly normalized!
  
  // --- 8. Pack Final Result ---
  let f = Number(sigZ) & 0x7FFFFF;
  let final_ui = (expZ << 23) | f; // Sign is implicitly 0
  
  return final_ui >>> 0;
}

// ============================================================================
// 6. MINIMUM & MAXIMUM
// ============================================================================

function exact_fmin_s(uiA, uiB) {
  uiA = Number(BigInt(uiA) & 0xFFFFFFFFn) >>> 0;
  uiB = Number(BigInt(uiB) & 0xFFFFFFFFn) >>> 0;

  // Detect NaNs (Exponent = 0xFF, Fraction != 0)
  let isNanA = ((uiA & 0x7F800000) === 0x7F800000) && ((uiA & 0x007FFFFF) !== 0);
  let isNanB = ((uiB & 0x7F800000) === 0x7F800000) && ((uiB & 0x007FFFFF) !== 0);

  // If both are NaN, return canonical NaN
  if (isNanA && isNanB) return 0x7FC00000;
  
  // If only one is NaN, return the other (IEEE 754 minNum behavior)
  if (isNanA) return uiB;
  if (isNanB) return uiA;

  // Use Float32Array to do native IEEE 754 comparisons safely
  let f32 = new Float32Array(2);
  let u32 = new Uint32Array(f32.buffer);
  u32[0] = uiA;
  u32[1] = uiB;
  
  // Extract sign bit of A
  let signA = (uiA >>> 31) & 1;

  // less = f32_lt_quiet(A, B) || (f32_eq(A, B) && (A.v & F32_SIGN))
  let less = (f32[0] < f32[1]) || (f32[0] === f32[1] && signA === 1);
  
  return less ? uiA : uiB;
}

function exact_fmax_s(uiA, uiB) {
  uiA = Number(BigInt(uiA) & 0xFFFFFFFFn) >>> 0;
  uiB = Number(BigInt(uiB) & 0xFFFFFFFFn) >>> 0;

  let isNanA = ((uiA & 0x7F800000) === 0x7F800000) && ((uiA & 0x007FFFFF) !== 0);
  let isNanB = ((uiB & 0x7F800000) === 0x7F800000) && ((uiB & 0x007FFFFF) !== 0);

  if (isNanA && isNanB) return 0x7FC00000;
  
  if (isNanA) return uiB;
  if (isNanB) return uiA;

  let f32 = new Float32Array(2);
  let u32 = new Uint32Array(f32.buffer);
  u32[0] = uiA;
  u32[1] = uiB;
  
  // Extract sign bit of B
  let signB = (uiB >>> 31) & 1;

  // greater = f32_lt_quiet(B, A) || (f32_eq(B, A) && (B.v & F32_SIGN))
  let greater = (f32[1] < f32[0]) || (f32[0] === f32[1] && signB === 1);
  
  return greater ? uiA : uiB;
}

// Add these helpers near your FALU code if you haven't already
const f32_view = new Float32Array(1);
const u32_view = new Uint32Array(f32_view.buffer);

// Safely extracts a 32-bit float from a 64-bit NaN-boxed register
function unbox_f32(rs1) {
  // If bits 63:32 are not all 1s, the value is an invalid NaN-box
  // and must be treated as a canonical NaN.
  if ((rs1 >> 32n) !== 0xFFFFFFFFn) {
    return NaN; // Or the encoded canonical NaN value
  }
  // Convert lower 32 bits to a JS Number (float32)
  u32_view[0] = Number(rs1 & 0xFFFFFFFFn);
  return f32_view[0];
}

// Universal IEEE-754 Float-to-Integer Rounding
function round_float_to_int(f, rm) {
  let trunc = Math.trunc(f);
  let frac = Math.abs(f - trunc);
  
  switch (rm) {
      case 0: // RNE (Round to Nearest, ties to Even)
          if (frac > 0.5) return trunc + Math.sign(f);
          if (frac < 0.5) return trunc;
          // Ties to Even
          return (trunc % 2 === 0 || trunc % 2 === -0) ? trunc : trunc + Math.sign(f);
          
      case 1: // RTZ (Round towards Zero)
          return trunc;
          
      case 2: // RDN (Round Down, towards -Infinity)
          return Math.floor(f);
          
      case 3: // RUP (Round Up, towards +Infinity)
          return Math.ceil(f);
          
      case 4: // RMM (Round to Nearest, ties to Max Magnitude)
          if (frac >= 0.5) return trunc + Math.sign(f);
          return trunc;
          
      default:
          throw new Error("Invalid rounding mode: " + rm);
  }
}

// Helper for exact 64-bit Integer to 32-bit Float Conversion
function exact_u64_to_f32_core(val, is_neg, rm) {
  // val is a positive BigInt > 0
  let str = val.toString(2);
  let len = str.length;
  
  let exp = len - 1;
  let sig = 0n;
  let round_bit = 0n;
  let sticky = 0n;
  
  // Extract the top 24 bits for the mantissa
  if (len <= 24) {
      sig = val << BigInt(24 - len);
  } else {
      let shift = BigInt(len - 24);
      sig = val >> shift;
      
      let mask = (1n << shift) - 1n;
      let discarded = val & mask;
      
      round_bit = (discarded >> (shift - 1n)) & 1n;
      sticky = (discarded & ((1n << (shift - 1n)) - 1n)) !== 0n ? 1n : 0n;
  }
  
  // --- IEEE 754 Universal Rounding ---
  let do_increment = false;
  switch (rm) {
      case 0: // RNE (Round to Nearest, ties to Even)
          if (round_bit === 1n && (sticky === 1n || (sig & 1n) === 1n)) do_increment = true;
          break;
      case 1: // RTZ (Round towards Zero)
          do_increment = false;
          break;
      case 2: // RDN (Round Down)
          if (is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true;
          break;
      case 3: // RUP (Round Up)
          if (!is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true;
          break;
      case 4: // RMM (Round to Nearest, ties to Max Magnitude)
          if (round_bit === 1n) do_increment = true;
          break;
      default:
          throw new Error("Invalid rounding mode: " + rm);
  }

  if (do_increment) {
      sig += 1n;
      if (sig >= 0x1000000n) { // Carry overflowed the mantissa
          sig >>= 1n;
          exp++;
      }
  }
  
  let f = Number(sig) & 0x7FFFFF; // Mask out the hidden bit
  let stored_exp = exp + 127;     // Apply IEEE-754 Bias
  
  let final_ui = ((is_neg ? 1 : 0) << 31) | (stored_exp << 23) | f;
  return final_ui >>> 0;
}

function exact_i64_to_f32(int_val, rm) {
  if (int_val === 0n) return 0x00000000;
  
  let is_neg = false;
  if (int_val < 0n) {
      is_neg = true;
      int_val = -int_val;
  }
  return exact_u64_to_f32_core(int_val, is_neg, rm);
}

function exact_ui64_to_f32(uint_val, rm) {
  if (uint_val === 0n) return 0x00000000;
  return exact_u64_to_f32_core(uint_val, false, rm);
}

$.FALU.F = {
  // ==========================================
  // FLOATING-POINT LOADS & STORES (F Extension)
  // Calculates: Address = rs1 + imm
  // ==========================================
  // Floating-point Load Word (32-bit)
  // CRITICAL: Your memory write-back stage MUST NaN-box the 32-bit result
  // before writing it to f_ram. (e.g., loaded_val | 0xFFFFFFFF00000000n)
  flw: (rs1, imm) => ({
    addr: BigInt.asUintN(64, rs1 + imm),
    bytes: 4,
    isFloat: true
  }),
  // Floating-point Store Word (32-bit)
  // Extracts and stores only the lower 32 bits of the floating point register.
  fsw: (rs1, rs2, imm) => ({
    addr: BigInt.asUintN(64, rs1 + imm),
    bytes: 4,
    value: BigInt.asUintN(32, rs2)
  }),

  fmadd_s:  (rs1, rs2, rs3, rm) => BigInt(exact_f32_mulAdd(rs1, rs2, rs3, 0, rm)) | 0xFFFFFFFF00000000n,
  fmsub_s:  (rs1, rs2, rs3, rm) => BigInt(exact_f32_mulAdd(rs1, rs2, rs3, 1, rm)) | 0xFFFFFFFF00000000n,
  fnmsub_s: (rs1, rs2, rs3, rm) => BigInt(exact_f32_mulAdd(rs1, rs2, rs3, 2, rm)) | 0xFFFFFFFF00000000n,
  fnmadd_s: (rs1, rs2, rs3, rm) => BigInt(exact_f32_mulAdd(rs1, rs2, rs3, 3, rm)) | 0xFFFFFFFF00000000n,

  fadd_s: (rs1, rs2, rm) => BigInt(exact_f32_add(rs1, rs2, rm)) | 0xFFFFFFFF00000000n,
  fsub_s: (rs1, rs2, rm) => BigInt(exact_f32_sub(rs1, rs2, rm)) | 0xFFFFFFFF00000000n,
  fmul_s: (rs1, rs2, rm) => BigInt(exact_f32_mul(rs1, rs2, rm)) | 0xFFFFFFFF00000000n,
  fdiv_s: (rs1, rs2, rm) => BigInt(exact_f32_div(rs1, rs2, rm)) | 0xFFFFFFFF00000000n,
  fsqrt_s: (rs1, rm) => BigInt(exact_f32_sqrt(rs1, rm)) | 0xFFFFFFFF00000000n,

  fsgnj_s: (rs1, rs2) => {
    let sign = rs2 & 0x80000000n;          // Extract bit 31 of rs2
    let fracExp = rs1 & 0x7FFFFFFFn;       // Extract bits 0-30 of rs1
    let res32 = sign | fracExp;
    
    return res32 | 0xFFFFFFFF00000000n;    // NaN-box the 32-bit result
  },
  // Sign Inject Not: Result has the inverted sign bit of rs2, and the fraction/exp of rs1.
  fsgnjn_s: (rs1, rs2) => {
    let sign = (~rs2) & 0x80000000n;       // Invert and extract bit 31 of rs2
    let fracExp = rs1 & 0x7FFFFFFFn;       // Extract bits 0-30 of rs1
    let res32 = sign | fracExp;
    
    return res32 | 0xFFFFFFFF00000000n;    // NaN-box the 32-bit result
  },
  // Sign Inject XOR: Result has the XOR'd sign bits of rs1 and rs2, and fraction/exp of rs1.
  fsgnjx_s: (rs1, rs2) => {
    let sign = (rs1 ^ rs2) & 0x80000000n;  // XOR bit 31 of rs1 and rs2
    let fracExp = rs1 & 0x7FFFFFFFn;       // Extract bits 0-30 of rs1
    let res32 = sign | fracExp;
    
    return res32 | 0xFFFFFFFF00000000n;    // NaN-box the 32-bit result
  },
  fmin_s: (rs1, rs2) => BigInt(exact_fmin_s(rs1, rs2)) | 0xFFFFFFFF00000000n,
  fmax_s: (rs1, rs2) => BigInt(exact_fmax_s(rs1, rs2)) | 0xFFFFFFFF00000000n,
  
  // ==========================================
  // FLOAT TO INTEGER CONVERSIONS
  // Result is written to the Integer Register File (x_ram)
  // ==========================================

  // Convert Float to Signed 32-bit Int
  fcvt_w_s: (rs1, rm) => {
    let f = unbox_f32(rs1);
    
    // Handle NaNs and Out-Of-Bounds (Saturation)
    if (Number.isNaN(f)) return 2147483647n; // NaN -> +Max_Int
    
    let rounded = round_float_to_int(f, rm);
    
    if (rounded >= 2147483647) return 2147483647n;
    if (rounded <= -2147483648) return -2147483648n; // -Min_Int
    
    // BigInt.asIntN handles the 64-bit sign-extension required by RV64 automatically
    return BigInt.asIntN(32, BigInt(rounded));
  },

  // Convert Float to Unsigned 32-bit Int
  fcvt_wu_s: (rs1, rm) => {
    let f = unbox_f32(rs1);
    
    // Handle NaNs and Out-Of-Bounds (Saturation)
    if (Number.isNaN(f)) return -1n; // NaN -> 0xFFFFFFFF (which sign-extends to -1n)
    
    let rounded = round_float_to_int(f, rm);;
    
    if (rounded >= 4294967295) return -1n; // +Max_Uint -> 0xFFFFFFFF -> -1n
    if (rounded <= 0) return 0n;
    
    // Spec mandates the 32-bit unsigned result is STILL sign-extended to 64-bits
    return BigInt.asIntN(32, BigInt(rounded));
  },
  // ==========================================
  // INTEGER TO FLOAT CONVERSIONS
  // Result is written to the Float Register File (f_ram)
  // ==========================================

  // Convert Signed 32-bit Int to Float
  // Convert Signed 32-bit Int to Float
  fcvt_s_w: (rs1, rm) => {
    // Read lower 32 bits and sign-extend to 64-bits
    let int_val = BigInt.asIntN(32, rs1);
    
    // Use your custom exact converter instead of Math.fround
    let res32 = exact_i64_to_f32(int_val, rm);
    
    // NaN-box the resulting float to 64-bits
    return BigInt(res32) | 0xFFFFFFFF00000000n;
  },

  // Convert Unsigned 32-bit Int to Float
  fcvt_s_wu: (rs1, rm) => {
    // Read lower 32 bits as unsigned
    let uint_val = BigInt.asUintN(32, rs1);
    
    let res32 = exact_ui64_to_f32(uint_val, rm);
    
    return BigInt(res32) | 0xFFFFFFFF00000000n;
  },

  // ==========================================
  // FLOATING-POINT / INTEGER REGISTER MOVES
  // ==========================================

  // Move from Float to Integer (RV64)
  // Extracts the lower 32 bits of the float register and sign-extends it
  // to 64 bits before writing it to the integer register.
  fmv_x_w: (rs1) => {
    return BigInt.asIntN(32, rs1);
  },

  // Move from Integer to Float
  // Extracts the lower 32 bits of the integer register and NaN-boxes it
  // into the 64-bit floating-point register.
  fmv_w_x: (rs1) => {
    return (rs1 & 0xFFFFFFFFn) | 0xFFFFFFFF00000000n;
  },

  // ==========================================
  // FLOATING-POINT COMPARES & CLASSIFY
  // Results are written to the Integer Register File (x_ram)
  // ==========================================

  // Floating-point Equal
  feq_s: (rs1, rs2) => {
    let f1 = unbox_f32(rs1);
    let f2 = unbox_f32(rs2);
    // JS '===' exactly mirrors IEEE 754 quiet equality (-0.0 === 0.0 is true, NaN === NaN is false)
    return (f1 === f2) ? 1n : 0n;
  },

  // Floating-point Less Than
  flt_s: (rs1, rs2) => {
    let f1 = unbox_f32(rs1);
    let f2 = unbox_f32(rs2);
    return (f1 < f2) ? 1n : 0n;
  },

  // Floating-point Less Than or Equal
  fle_s: (rs1, rs2) => {
    let f1 = unbox_f32(rs1);
    let f2 = unbox_f32(rs2);
    return (f1 <= f2) ? 1n : 0n;
  },

  // Floating-point Classify
  // Examines the value and sets exactly one bit in the integer result corresponding to the class
  fclass_s: (rs1) => {
    let val = Number(rs1 & 0xFFFFFFFFn);
    
    // RISC-V Spec: If not properly NaN-boxed, it is treated as a canonical NaN.
    if ((rs1 >> 32n) !== 0xFFFFFFFFn) {
      val = 0x7FC00000; // Canonical NaN
    }
    
    let sign = val >>> 31;
    let exp = (val >>> 23) & 0xFF;
    let frac = val & 0x7FFFFF;
    
    let res = 0n;
    
    if (exp === 0) {
      if (frac === 0) {
        res = sign ? (1n << 3n) : (1n << 4n); // 3: -0, 4: +0
      } else {
        res = sign ? (1n << 2n) : (1n << 5n); // 2: -subnormal, 5: +subnormal
      }
    } else if (exp === 0xFF) {
      if (frac === 0) {
        res = sign ? (1n << 0n) : (1n << 7n); // 0: -infinity, 7: +infinity
      } else {
        // In RISC-V, a signaling NaN has the MSB of the fraction set to 0.
        if ((frac & 0x400000) === 0) {
          res = 1n << 8n; // 8: Signaling NaN
        } else {
          res = 1n << 9n; // 9: Quiet NaN
        }
      }
    } else {
      res = sign ? (1n << 1n) : (1n << 6n);   // 1: -normal, 6: +normal
    }
    
    return res;
  },
}

// Performs infinitely precise IEEE-754 64-bit FMA matching SoftFloat
function exact_f64_mulAdd(uiA, uiB, uiC, op, rm) {
  // Force inputs to 64-bit unsigned BigInts
  uiA &= 0xFFFFFFFFFFFFFFFFn;
  uiB &= 0xFFFFFFFFFFFFFFFFn;
  uiC &= 0xFFFFFFFFFFFFFFFFn;

  // Helper to unpack F64 into exact integer mantissa and shifted exponent
  function unpackF64(ui) {
      let sign = (ui >> 63n) === 1n ? -1 : 1;
      let e = Number((ui >> 52n) & 0x7FFn);
      let f = ui & 0xFFFFFFFFFFFFFn;
     
      if (e === 0x7FF) return { sign, mant: 0n, exp: 0, isNaN: f !== 0n, isInf: f === 0n, isZero: false };
      if (e === 0) {
          if (f === 0n) return { sign, mant: 0n, exp: 0, isNaN: false, isInf: false, isZero: true };
          // Subnormal: No hidden bit, exponent is locked to -1022
          return { sign, mant: f, exp: -1022 - 52, isNaN: false, isInf: false, isZero: false };
      }
      // Normal: Add hidden bit (0x10000000000000 = 1 << 52)
      return { sign, mant: f | 0x10000000000000n, exp: e - 1023 - 52, isNaN: false, isInf: false, isZero: false };
  }

  const A = unpackF64(uiA);
  const B = unpackF64(uiB);
  const C = unpackF64(uiC);

  // op: 0 = fmadd, 1 = fmsub, 2 = fnmsub, 3 = fnmadd
  let sProd = A.sign * B.sign * ((op === 2 || op === 3) ? -1 : 1);
  let sC = C.sign * ((op === 1 || op === 3) ? -1 : 1);

  const defaultNaN = 0x7FF8000000000000n; // RISC-V Canonical NaN for RV64 D

  // --- Special Cases ---
  if (A.isNaN || B.isNaN || C.isNaN) return defaultNaN;
  if ((A.isInf && B.isZero) || (A.isZero && B.isInf)) return defaultNaN;
 
  let prodIsInf = A.isInf || B.isInf;
  if (prodIsInf) {
      if (C.isInf && sProd !== sC) return defaultNaN; // Inf - Inf
      return sProd === -1 ? 0xFFF0000000000000n : 0x7FF0000000000000n;
  }
  if (C.isInf) return sC === -1 ? 0xFFF0000000000000n : 0x7FF0000000000000n;

  let prodIsZero = A.isZero || B.isZero;
  if (prodIsZero && C.isZero) {
      if (sProd === sC) return sProd === -1 ? 0x8000000000000000n : 0x0000000000000000n;
      // IEEE 754: x + (-x) = +0 for round-to-nearest. Only -0 for RDN (rm=2).
      return rm === 2 ? 0x8000000000000000n : 0x0000000000000000n; 
  }

  // --- Infinite Precision Arithmetic ---
  let M_prod = prodIsZero ? 0n : A.mant * B.mant;
  let P_prod = A.exp + B.exp;
  let M_C = C.isZero ? 0n : C.mant;
  let P_C = C.exp;
 
  // Align mantissas to the lowest exponent
  let P_res = Math.min(P_prod, P_C);
  if (!prodIsZero && P_prod > P_res) M_prod <<= BigInt(P_prod - P_res);
  if (!C.isZero && P_C > P_res) M_C <<= BigInt(P_C - P_res);

  let val_prod = sProd === -1 ? -M_prod : M_prod;
  let val_C = sC === -1 ? -M_C : M_C;

  let res_mant = val_prod + val_C;
  if (res_mant === 0n) return rm === 2 ? 0x8000000000000000n : 0x0000000000000000n;

  let res_sign = 1;
  if (res_mant < 0n) {
      res_sign = -1;
      res_mant = -res_mant; // abs
  }

  // --- Normalization & Rounding ---
  let mant_len = res_mant.toString(2).length;
  let shift = mant_len - 53; // Target is exactly 53 bits (52 frac + 1 hidden)
  let final_exp = P_res + shift;
  let stored_e = final_exp + 52 + 1023;
 
  let sticky = 0n;
  let round_bit = 0n;
  let sig = res_mant;
 
  if (shift > 0) {
      let shift_n = BigInt(shift);
      let mask = (1n << shift_n) - 1n;
      let discarded = res_mant & mask;
      round_bit = (discarded >> (shift_n - 1n)) & 1n;
      sticky = (discarded & ((1n << (shift_n - 1n)) - 1n)) !== 0n ? 1n : 0n;
      sig = res_mant >> shift_n;
  } else if (shift < 0) {
      sig = res_mant << BigInt(-shift);
  }

  // Handle Subnormals / Underflow
  if (stored_e <= 0) {
      let sub_shift = 1 - stored_e;
      let shift_n = BigInt(sub_shift);
     
      if (shift_n >= 55n) { // Shifted entirely out of precision bounds
          sig = 0n;
          round_bit = 0n;
          sticky = 1n; 
      } else {
          let mask = (1n << shift_n) - 1n;
          let discarded = sig & mask;
          let new_round = (discarded >> (shift_n - 1n)) & 1n;
          let new_sticky = (discarded & ((1n << (shift_n - 1n)) - 1n)) !== 0n ? 1n : 0n;
         
          // Carry over previous sticky bits
          if (round_bit === 1n || sticky === 1n) new_sticky = 1n;
         
          sig >>= shift_n;
          round_bit = new_round;
          sticky = new_sticky;
      }
      stored_e = 0;
  } else if (stored_e >= 0x7FF) {
      return res_sign === -1 ? 0xFFF0000000000000n : 0x7FF0000000000000n; // Overflow to Inf
  }

  // --- IEEE 754 Universal Rounding ---
  let do_increment = false;
  let is_neg = (res_sign === -1);

  switch (rm) {
      case 0: // RNE
          if (round_bit === 1n && (sticky === 1n || (sig & 1n) === 1n)) do_increment = true;
          break;
      case 1: // RTZ
          do_increment = false; 
          break;
      case 2: // RDN
          if (is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true;
          break;
      case 3: // RUP
          if (!is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true;
          break;
      case 4: // RMM
          if (round_bit === 1n) do_increment = true;
          break;
      default:
          throw new Error("Invalid rounding mode: " + rm);
  }

  if (do_increment) {
      sig += 1n;
  }
 
  // Post-rounding Overflow check
  if (sig === 0x20000000000000n) { // Mantissa overflowed 53-bits (1 << 53)
      sig >>= 1n;
      stored_e += 1;
      if (stored_e === 0x7FF) return res_sign === -1 ? 0xFFF0000000000000n : 0x7FF0000000000000n;
  } else if (stored_e === 0 && sig === 0x10000000000000n) {
      stored_e = 1; // Subnormal rounded up to lowest normal
  }

  // --- Pack IEEE 754 ---
  let f = sig & 0xFFFFFFFFFFFFFn; // Mask out the hidden bit
  let final_ui = (res_sign === -1 ? 0x8000000000000000n : 0n) | (BigInt(stored_e) << 52n) | f;
 
  return final_ui;
}

function exact_f64_add(uiA, uiB, rm) {
  // A * 1.0 + B
  return exact_f64_mulAdd(uiA, 0x3FF0000000000000n, uiB, 0, rm);
}

function exact_f64_sub(uiA, uiB, rm) {
  // A * 1.0 - B
  return exact_f64_mulAdd(uiA, 0x3FF0000000000000n, uiB, 1, rm);
}

function exact_f64_mul(uiA, uiB, rm) {
  // A * B + 0.0
  return exact_f64_mulAdd(uiA, uiB, 0x0000000000000000n, 0, rm);
}

function exact_f64_div(uiA, uiB, rm) {
  uiA &= 0xFFFFFFFFFFFFFFFFn;
  uiB &= 0xFFFFFFFFFFFFFFFFn;

  let signA = (uiA >> 63n) & 1n;
  let expA = Number((uiA >> 52n) & 0x7FFn);
  let sigA = uiA & 0xFFFFFFFFFFFFFn;

  let signB = (uiB >> 63n) & 1n;
  let expB = Number((uiB >> 52n) & 0x7FFn);
  let sigB = uiB & 0xFFFFFFFFFFFFFn;

  let signZ = signA ^ signB;
  const defaultNaN = 0x7FF8000000000000n; // Canonical NaN for RV64 D

  // --- NaNs and Infinities ---
  if (expA === 0x7FF) {
      if (sigA !== 0n) return defaultNaN;
      if (expB === 0x7FF) {
          if (sigB !== 0n) return defaultNaN;
          return defaultNaN; // Inf / Inf
      }
      return (signZ << 63n) | 0x7FF0000000000000n; // Inf / Normal
  }
  if (expB === 0x7FF) {
      if (sigB !== 0n) return defaultNaN;
      return (signZ << 63n); // Normal / Inf = 0
  }

  // --- Zeros and Subnormals ---
  if (expB === 0) {
      if (sigB === 0n) {
          if (expA === 0 && sigA === 0n) return defaultNaN; // 0 / 0
          return (signZ << 63n) | 0x7FF0000000000000n; // Normal / 0 = Inf
      }
      while ((sigB & 0x10000000000000n) === 0n) { sigB <<= 1n; expB--; }
      sigB &= 0xFFFFFFFFFFFFFn;
  }
  if (expA === 0) {
      if (sigA === 0n) return (signZ << 63n); // 0 / Normal = 0
      while ((sigA & 0x10000000000000n) === 0n) { sigA <<= 1n; expA--; }
      sigA &= 0xFFFFFFFFFFFFFn;
  }

  // --- Infinite Precision Division ---
  let expZ = expA - expB + 1022; // Bias - 1
  let mantA = sigA | 0x10000000000000n;
  let mantB = sigB | 0x10000000000000n;

  // Shift A way up. Target: 52 bit mantissa + 2 for rounding/sticky = 54 bits
  if (mantA < mantB) {
      expZ--;
      mantA <<= 55n;
  } else {
      mantA <<= 54n;
  }

  let sigZ = mantA / mantB;
  let remainder = mantA % mantB;

  let sticky = remainder !== 0n ? 1n : 0n;
  let round_bit = sigZ & 1n;
  sigZ >>= 1n; 

  // --- Subnormal Result Handling ---
  if (expZ <= 0) {
      let shift = 1 - expZ;
      if (shift > 54) {
          sigZ = 0n; round_bit = 0n; sticky = 1n;
      } else {
          let shift_n = BigInt(shift);
          let mask = (1n << shift_n) - 1n;
          let discarded = sigZ & mask;
          
          let new_round = (discarded >> (shift_n - 1n)) & 1n;
          let new_sticky = ((discarded & ((1n << (shift_n - 1n)) - 1n)) !== 0n || round_bit === 1n || sticky === 1n) ? 1n : 0n;
          
          sigZ >>= shift_n;
          round_bit = new_round;
          sticky = new_sticky;
      }
      expZ = 0;
  }

  // --- IEEE 754 Universal Rounding ---
  let do_increment = false;
  let is_neg = (signZ === 1n);

  switch (rm) {
      case 0: if (round_bit === 1n && (sticky === 1n || (sigZ & 1n) === 1n)) do_increment = true; break;
      case 1: do_increment = false; break;
      case 2: if (is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true; break;
      case 3: if (!is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true; break;
      case 4: if (round_bit === 1n) do_increment = true; break;
      default: throw new Error("Invalid rounding mode");
  }

  if (do_increment) sigZ += 1n;

  // --- Overflow Check Post-Rounding ---
  if (sigZ >= 0x20000000000000n) { // 1 << 53
      sigZ >>= 1n;
      expZ++;
  } else if (expZ === 0 && sigZ >= 0x10000000000000n) {
      expZ = 1;
  }

  if (expZ >= 0x7FF) return (signZ << 63n) | 0x7FF0000000000000n; // Overflow to Inf

  let f = sigZ & 0xFFFFFFFFFFFFFn;
  return (signZ << 63n) | (BigInt(expZ) << 52n) | f;
}
const exact_f64_sqrt = (function() {
  function bigint_isqrt(n) {
    if (n === 0n) return 0n;
    // slightly safer initial guess sizing
    let x0 = 1n << ((BigInt(n.toString(2).length) + 1n) >> 1n);
    while (true) {
        let x1 = (x0 + n / x0) >> 1n;
        if (x1 >= x0) {
            // Check if we accidentally settled on r+1 instead of r
            return (x0 * x0 > n) ? x0 - 1n : x0;
        }
        x0 = x1;
    }
}
  return function(a_bits, rm) {
      let uiA = BigInt.asUintN(64, a_bits);
      let signA = (uiA >> 63n) & 1n;
      let expA = Number((uiA >> 52n) & 0x7FFn);
      let sigA = uiA & 0x000FFFFFFFFFFFFFn;
      if (expA === 0x7FF) {
          if (sigA !== 0n) return uiA | 0x0008000000000000n; 
          if (signA === 0n) return uiA; 
          return 0x7FF8000000000000n; 
      }
      if (signA === 1n) {
          if (expA === 0 && sigA === 0n) return uiA; 
          return 0x7FF8000000000000n; 
      }
      if (expA === 0 && sigA === 0n) return uiA; 
      let actual_exp = expA === 0 ? -1022 : expA - 1023;
      let M = sigA;
      if (expA === 0) {
          while ((M & 0x10000000000000n) === 0n) {
              M <<= 1n; 
              actual_exp--;
          }
      } else {
          M |= 0x10000000000000n; 
      }
      if ((actual_exp & 1) !== 0) {
          M <<= 1n;
          actual_exp--;
      }
      let M_scaled = M << 106n;
      let z = bigint_isqrt(M_scaled);
      let shift_amt = 27n;
      let sigZ = z >> shift_amt;
      
      let round_bit = (z >> (shift_amt - 1n)) & 1n;
      let shifted_out = (z & ((1n << (shift_amt - 1n)) - 1n)) !== 0n;
      let rem = M_scaled - (z * z); 
      let sticky = shifted_out || (rem !== 0n);
      // --- Correct IEEE-754 Rounding based on resolved 'rm' ---
      let round_up = false;
      
      if (rm === 0) { // RNE: Round to Nearest, ties to Even
          if (round_bit === 1n && (sticky || (sigZ & 1n) === 1n)) round_up = true;
      } else if (rm === 1) { // RTZ: Round to Zero (Truncate)
          round_up = false;
      } else if (rm === 2) { // RDN: Round Down (Towards -Inf)
          round_up = false; // Sqrt is always positive, so down is truncate
      } else if (rm === 3) { // RUP: Round Up (Towards +Inf)
          if (round_bit === 1n || sticky) round_up = true;
      } else if (rm === 4) { // RMM: Round to Max Magnitude
          if (round_bit === 1n) round_up = true;
      }
      let expZ = Math.floor(actual_exp / 2) + 1023;
      if (round_up) {
          sigZ++;
          if (sigZ >= 0x20000000000000n) {
              sigZ >>= 1n;
              expZ++;
          }
      }
      sigZ &= 0x000FFFFFFFFFFFFFn;
      return (signA << 63n) | (BigInt(expZ) << 52n) | sigZ;
  };
})();
// ============================================================================
// EXACT DOUBLE-PRECISION MINIMUM & MAXIMUM
// ============================================================================

function exact_fmin_d(uiA, uiB) {
  uiA &= 0xFFFFFFFFFFFFFFFFn;
  uiB &= 0xFFFFFFFFFFFFFFFFn;

  // Detect NaNs (Exponent = 0x7FF, Fraction != 0)
  let isNanA = ((uiA & 0x7FF0000000000000n) === 0x7FF0000000000000n) && ((uiA & 0x000FFFFFFFFFFFFFn) !== 0n);
  let isNanB = ((uiB & 0x7FF0000000000000n) === 0x7FF0000000000000n) && ((uiB & 0x000FFFFFFFFFFFFFn) !== 0n);

  // If both are NaN, return canonical NaN (0x7FF8000000000000)
  if (isNanA && isNanB) return 0x7FF8000000000000n;
  
  // If only one is NaN, return the other (IEEE 754 minNum behavior)
  if (isNanA) return uiB;
  if (isNanB) return uiA;

  // Use Float64Array to do native IEEE 754 comparisons safely
  let f64 = new Float64Array(2);
  let u64 = new BigUint64Array(f64.buffer);
  u64[0] = uiA;
  u64[1] = uiB;
  
  // Extract sign bit of A
  let signA = (uiA >> 63n) & 1n;

  // less = f64_lt_quiet(A, B) || (f64_eq(A, B) && (A.v & F64_SIGN))
  let less = (f64[0] < f64[1]) || (f64[0] === f64[1] && signA === 1n);
  
  return less ? uiA : uiB;
}

function exact_fmax_d(uiA, uiB) {
  uiA &= 0xFFFFFFFFFFFFFFFFn;
  uiB &= 0xFFFFFFFFFFFFFFFFn;

  let isNanA = ((uiA & 0x7FF0000000000000n) === 0x7FF0000000000000n) && ((uiA & 0x000FFFFFFFFFFFFFn) !== 0n);
  let isNanB = ((uiB & 0x7FF0000000000000n) === 0x7FF0000000000000n) && ((uiB & 0x000FFFFFFFFFFFFFn) !== 0n);

  if (isNanA && isNanB) return 0x7FF8000000000000n;
  
  if (isNanA) return uiB;
  if (isNanB) return uiA;

  let f64 = new Float64Array(2);
  let u64 = new BigUint64Array(f64.buffer);
  u64[0] = uiA;
  u64[1] = uiB;
  
  // Extract sign bit of B
  let signB = (uiB >> 63n) & 1n;

  // greater = f64_lt_quiet(B, A) || (f64_eq(B, A) && (B.v & F64_SIGN))
  let greater = (f64[1] < f64[0]) || (f64[0] === f64[1] && signB === 1n);
  
  return greater ? uiA : uiB;
}

function exact_f64_to_f32(uiA, rm) {
  uiA &= 0xFFFFFFFFFFFFFFFFn;
  let sign = (uiA >> 63n) & 1n;
  let exp = Number((uiA >> 52n) & 0x7FFn);
  let sig = uiA & 0xFFFFFFFFFFFFFn;

  // --- Special Cases ---
  if (exp === 0x7FF) {
      if (sig !== 0n) return 0x7FC00000; // NaN -> Canonical 32-bit NaN
      return ((Number(sign) << 31) | 0x7F800000) >>> 0; // Inf
  }
  if (exp === 0 && sig === 0n) {
      return ((Number(sign) << 31) | 0) >>> 0; // Zero
  }

  let actual_exp = exp === 0 ? -1022 : exp - 1023;
  let mant = exp === 0 ? sig : (sig | 0x10000000000000n);

  // Single precision bias is 127. 
  // Shift down by 29 bits (52 - 23) to align the mantissas.
  let shift = 29;
  let target_exp = actual_exp + 127;
  let sticky = 0n;
  let round_bit = 0n;
  
  // Subnormal handling for 32-bit boundaries
  if (target_exp <= 0) {
      shift += (1 - target_exp);
      target_exp = 0;
  }

  if (shift > 54) {
      mant = 0n;
      round_bit = 0n;
      sticky = 1n;
  } else if (shift > 0) {
      let shift_n = BigInt(shift);
      let mask = (1n << shift_n) - 1n;
      let discarded = mant & mask;
      round_bit = (discarded >> (shift_n - 1n)) & 1n;
      sticky = (discarded & ((1n << (shift_n - 1n)) - 1n)) !== 0n ? 1n : 0n;
      mant >>= shift_n;
  } else if (shift < 0) {
      mant <<= BigInt(-shift);
  }

  let sig32 = mant;
  
  // --- IEEE 754 Universal Rounding ---
  let do_increment = false;
  let is_neg = (sign === 1n);

  switch (rm) {
      case 0: if (round_bit === 1n && (sticky === 1n || (sig32 & 1n) === 1n)) do_increment = true; break;
      case 1: do_increment = false; break;
      case 2: if (is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true; break;
      case 3: if (!is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true; break;
      case 4: if (round_bit === 1n) do_increment = true; break;
      default: throw new Error("Invalid rounding mode: " + rm);
  }

  if (do_increment) {
      sig32 += 1n;
      if (sig32 >= 0x1000000n) {
          sig32 >>= 1n;
          target_exp++;
      }
  } else if (target_exp === 0 && sig32 >= 0x800000n) {
      target_exp = 1; // Subnormal rounded up to lowest normal
  }

  // Overflow to Infinity check
  if (target_exp >= 0xFF) {
      return ((Number(sign) << 31) | 0x7F800000) >>> 0;
  }

  let f = Number(sig32) & 0x7FFFFF;
  return ((Number(sign) << 31) | (target_exp << 23) | f) >>> 0;
}

function exact_f32_to_f64(rs1) {
  // Unbox extracts the 32-bit float safely, returning JS NaN if it's invalid
  let f32 = unbox_f32(rs1);
  
  // Canonical RISC-V 64-bit NaN 
  if (Number.isNaN(f32)) return 0x7FF8000000000000n; 
  
  let f64_arr = new Float64Array(1);
  let u64_arr = new BigUint64Array(f64_arr.buffer);
  
  f64_arr[0] = f32; // JS natively upcasts EXACTLY
  return u64_arr[0];
}

// Quick helper to read 64-bit register cleanly into JS native Double
function get_f64_as_number(rs1) {
  let f64 = new Float64Array(1);
  let u64 = new BigUint64Array(f64.buffer);
  u64[0] = rs1 & 0xFFFFFFFFFFFFFFFFn;
  return f64[0];
}

// ============================================================================
// EXACT 64-BIT FLOAT TO 64-BIT INTEGER CONVERSIONS
// ============================================================================
function exact_f64_to_int(rs1, rm, isUnsigned) {
  rs1 &= 0xFFFFFFFFFFFFFFFFn;
  let sign = (rs1 >> 63n) & 1n;
  let exp = Number((rs1 >> 52n) & 0x7FFn);
  let sig = rs1 & 0xFFFFFFFFFFFFFn;

  // --- Special Cases & Saturation Rules ---
  if (exp === 0x7FF) { // NaN or Infinity
      if (sig !== 0n) return isUnsigned ? 0xFFFFFFFFFFFFFFFFn : 0x7FFFFFFFFFFFFFFFn; // NaN -> Max
      // Infinity
      return (sign === 1n) ? (isUnsigned ? 0n : -9223372036854775808n) : 
                             (isUnsigned ? 0xFFFFFFFFFFFFFFFFn : 0x7FFFFFFFFFFFFFFFn);
  }
  if (exp === 0 && sig === 0n) return 0n;

  let actual_exp = exp === 0 ? -1022 : exp - 1023;
  let mant = exp === 0 ? sig : (sig | 0x10000000000000n);

  // Shift the 52-bit fractional mantissa to find the integer value
  let shift = 52 - actual_exp;

  let res_int = 0n;
  let round_bit = 0n;
  let sticky = 0n;

  if (shift > 65) {
      res_int = 0n;
      round_bit = 0n;
      sticky = 1n; // Value is purely fractional
  } else if (shift > 0) {
      let shift_n = BigInt(shift);
      let mask = (1n << shift_n) - 1n;
      let discarded = mant & mask;
      round_bit = (discarded >> (shift_n - 1n)) & 1n;
      sticky = (discarded & ((1n << (shift_n - 1n)) - 1n)) !== 0n ? 1n : 0n;
      res_int = mant >> shift_n;
  } else {
      res_int = mant << BigInt(-shift); // Number is > 2^52, shift left
  }

  let is_neg = (sign === 1n);
  let do_increment = false;

  // --- Universal IEEE 754 Integer Rounding ---
  switch (rm) {
      case 0: if (round_bit === 1n && (sticky === 1n || (res_int & 1n) === 1n)) do_increment = true; break;
      case 1: do_increment = false; break; // RTZ
      case 2: if (is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true; break;
      case 3: if (!is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true; break;
      case 4: if (round_bit === 1n) do_increment = true; break;
      default: throw new Error("Invalid rounding mode: " + rm);
  }

  if (do_increment) res_int += 1n;
  if (is_neg) res_int = -res_int;

  // --- RISC-V Strict Bounds Checking ---
  if (isUnsigned) {
      if (res_int >= 18446744073709551615n) return 18446744073709551615n; // +Max_Uint64
      if (res_int <= 0n) return 0n;
      return BigInt.asUintN(64, res_int); // -1n safely casts
  } else {
      if (res_int >= 9223372036854775807n) return 9223372036854775807n; // +Max_Int64
      if (res_int <= -9223372036854775808n) return -9223372036854775808n; // -Min_Int64
      return BigInt.asIntN(64, res_int);
  }
}

// ============================================================================
// EXACT 64-BIT INTEGER TO 64-BIT FLOAT CONVERSIONS
// ============================================================================
function exact_u64_to_f64_core(val, is_neg, rm) {
  if (val === 0n) return (is_neg ? 0x8000000000000000n : 0n);
  
  let str = val.toString(2);
  let len = str.length;
  
  let exp = len - 1;
  let sig = 0n;
  let round_bit = 0n;
  let sticky = 0n;
  
  // Target is exactly 53 bits of precision (52 frac + 1 hidden)
  if (len <= 53) {
      sig = val << BigInt(53 - len);
  } else {
      let shift = BigInt(len - 53);
      sig = val >> shift;
      
      let mask = (1n << shift) - 1n;
      let discarded = val & mask;
      round_bit = (discarded >> (shift - 1n)) & 1n;
      sticky = (discarded & ((1n << (shift - 1n)) - 1n)) !== 0n ? 1n : 0n;
  }
  
  let do_increment = false;
  switch (rm) {
      case 0: if (round_bit === 1n && (sticky === 1n || (sig & 1n) === 1n)) do_increment = true; break;
      case 1: do_increment = false; break;
      case 2: if (is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true; break;
      case 3: if (!is_neg && (round_bit === 1n || sticky === 1n)) do_increment = true; break;
      case 4: if (round_bit === 1n) do_increment = true; break;
      default: throw new Error("Invalid rounding mode: " + rm);
  }

  if (do_increment) {
      sig += 1n;
      if (sig >= 0x20000000000000n) { // Overflowed 53-bits (1 << 53)
          sig >>= 1n;
          exp++;
      }
  }
  
  let f = sig & 0xFFFFFFFFFFFFFn; // Mask out the hidden bit
  let stored_exp = exp + 1023;
  return ((is_neg ? 1n : 0n) << 63n) | (BigInt(stored_exp) << 52n) | f;
}

function exact_i64_to_f64(int_val, rm) {
  if (int_val === 0n) return 0n;
  let is_neg = false;
  if (int_val < 0n) {
      is_neg = true;
      int_val = -int_val;
  }
  return exact_u64_to_f64_core(int_val, is_neg, rm);
}
function exact_ui64_to_f64(uint_val, rm) {
  if (uint_val === 0n) return 0n;
  return exact_u64_to_f64_core(uint_val, false, rm);
}

$.FALU.D = {
  // ==========================================
  // DOUBLE-PRECISION LOADS & STORES (D Extension)
  // Calculates: Address = rs1 + imm
  // ==========================================

  // Floating-point Load Double (64-bit)
  fld: (rs1, imm) => ({
    addr: BigInt.asUintN(64, rs1 + imm),
    bytes: 8,
    isFloat: true
  }),

  // Floating-point Store Double (64-bit)
  fsd: (rs1, rs2, imm) => ({
    addr: BigInt.asUintN(64, rs1 + imm),
    bytes: 8,
    // We mask the lower 64-bits of the floating point register (rs2) to store.
    // If you switch to the 32-bit array technique, your memory controller 
    // will just read limbs 0 and 1 instead.
    value: BigInt.asUintN(64, rs2)
  }),

  fmadd_d:  (rs1, rs2, rs3, rm) => exact_f64_mulAdd(rs1, rs2, rs3, 0, rm),
  fmsub_d:  (rs1, rs2, rs3, rm) => exact_f64_mulAdd(rs1, rs2, rs3, 1, rm),
  fnmsub_d: (rs1, rs2, rs3, rm) => exact_f64_mulAdd(rs1, rs2, rs3, 2, rm),
  fnmadd_d: (rs1, rs2, rs3, rm) => exact_f64_mulAdd(rs1, rs2, rs3, 3, rm),

  fadd_d: (rs1, rs2, rm) => exact_f64_add(rs1, rs2, rm),
  fsub_d: (rs1, rs2, rm) => exact_f64_sub(rs1, rs2, rm),
  fmul_d: (rs1, rs2, rm) => exact_f64_mul(rs1, rs2, rm),
  fdiv_d: (rs1, rs2, rm) => exact_f64_div(rs1, rs2, rm),
  fsqrt_d: (rs1, rm) => exact_f64_sqrt(rs1, rm),

  fsgnj_d: (rs1, rs2) => {
    let sign = rs2 & 0x8000000000000000n;           // Extract bit 63 of rs2
    let mag = rs1 & 0x7FFFFFFFFFFFFFFFn;            // Extract bits 0-62 of rs1
    return sign | mag;
  },
  fsgnjn_d: (rs1, rs2) => {
    let sign = (~rs2) & 0x8000000000000000n;        // Invert and extract bit 63 of rs2
    let mag = rs1 & 0x7FFFFFFFFFFFFFFFn;            // Extract bits 0-62 of rs1
    return sign | mag;
  },
  fsgnjx_d: (rs1, rs2) => {
    let sign = (rs1 ^ rs2) & 0x8000000000000000n;   // XOR bit 63 of rs1 and rs2
    let mag = rs1 & 0x7FFFFFFFFFFFFFFFn;            // Extract bits 0-62 of rs1
    return sign | mag;
  },
  fmin_d: (rs1, rs2) => exact_fmin_d(rs1, rs2),
  fmax_d: (rs1, rs2) => exact_fmax_d(rs1, rs2),

  fcvt_s_d: (rs1, rm) => {
    let res32 = exact_f64_to_f32(rs1, rm);
    return BigInt(res32) | 0xFFFFFFFF00000000n;
},

// Convert Single to Double (Produces 64-bit Float -> No NaN-Box)
fcvt_d_s: (rs1) => {
    return exact_f32_to_f64(rs1);
},

// Convert Double to Signed 32-bit Int
fcvt_w_d: (rs1, rm) => {
      let f = get_f64_as_number(rs1);
      
      if (Number.isNaN(f)) return 2147483647n; // NaN -> +Max_Int
      
      let rounded = round_float_to_int(f, rm);
      
      if (rounded >= 2147483647) return 2147483647n;
      if (rounded <= -2147483648) return -2147483648n; // -Min_Int
      
      return BigInt.asIntN(32, BigInt(rounded));
  },

  // Convert Double to Unsigned 32-bit Int
  fcvt_wu_d: (rs1, rm) => {
      let f = get_f64_as_number(rs1);
      
      if (Number.isNaN(f)) return -1n; // NaN -> 0xFFFFFFFF (which sign-extends to -1n)
      
      let rounded = round_float_to_int(f, rm);
      
      if (rounded >= 4294967295) return -1n; 
      if (rounded <= 0) return 0n;
      
      return BigInt.asIntN(32, BigInt(rounded));
  },

  fcvt_l_d:  (rs1, rm) => exact_f64_to_int(rs1, rm, false),
      fcvt_lu_d: (rs1, rm) => exact_f64_to_int(rs1, rm, true),

      // --- 64-Bit Integer to 64-Bit Float (RV64 Specific) ---
      fcvt_d_l:  (rs1, rm) => exact_i64_to_f64(BigInt.asIntN(64, rs1), rm),
      fcvt_d_lu: (rs1, rm) => exact_ui64_to_f64(BigInt.asUintN(64, rs1), rm),

      // --- 32-Bit Integer to 64-Bit Float (Always exact) ---
      fcvt_d_w: (rs1) => {
          let int_val = Number(BigInt.asIntN(32, rs1));
          let f64 = new Float64Array(1);
          let u64 = new BigUint64Array(f64.buffer);
          f64[0] = int_val;
          return u64[0];
      },
      fcvt_d_wu: (rs1) => {
          let int_val = Number(BigInt.asUintN(32, rs1));
          let f64 = new Float64Array(1);
          let u64 = new BigUint64Array(f64.buffer);
          f64[0] = int_val;
          return u64[0];
      },

      // --- Register Moves (RV64 Specific) ---
      fmv_x_d: (rs1) => rs1, // 64-bit float -> 64-bit Int
      fmv_d_x: (rs1) => rs1, // 64-bit Int -> 64-bit Float

      // --- Comparisons (Output to Integer Register) ---
      // JS quiet comparisons exactly match IEEE 754 RISC-V Spec!
      feq_d: (rs1, rs2) => (get_f64_as_number(rs1) === get_f64_as_number(rs2)) ? 1n : 0n,
      flt_d: (rs1, rs2) => (get_f64_as_number(rs1) < get_f64_as_number(rs2)) ? 1n : 0n,
      fle_d: (rs1, rs2) => (get_f64_as_number(rs1) <= get_f64_as_number(rs2)) ? 1n : 0n,

      // --- Floating-point Classify ---
      fclass_d: (rs1) => {
          let sign = (rs1 >> 63n) & 1n;
          let exp = Number((rs1 >> 52n) & 0x7FFn);
          let sig = rs1 & 0xFFFFFFFFFFFFFn;
          
          let res = 0n;
          if (exp === 0) {
              if (sig === 0n) {
                  res = sign ? (1n << 3n) : (1n << 4n); // 3: -0, 4: +0
              } else {
                  res = sign ? (1n << 2n) : (1n << 5n); // 2: -subnormal, 5: +subnormal
              }
          } else if (exp === 0x7FF) {
              if (sig === 0n) {
                  res = sign ? (1n << 0n) : (1n << 7n); // 0: -infinity, 7: +infinity
              } else {
                  // In RISC-V, a signaling NaN has the MSB of the fraction set to 0.
                  if ((sig & 0x8000000000000n) === 0n) {
                      res = 1n << 8n; // 8: Signaling NaN
                  } else {
                      res = 1n << 9n; // 9: Quiet NaN
                  }
              }
          } else {
              res = sign ? (1n << 1n) : (1n << 6n);     // 1: -normal, 6: +normal
          }
          return res;
      }
} 
// ==========================================
// COMPRESSED INSTRUCTIONS (C)
// Decompresses 16-bit instructions into standard 32-bit instructions
// ==========================================
// Builders for 32-bit standard instruction formats
$.C = {
  // ==========================================
  // LOADS AND STORES
  // ==========================================
  LoadsStores: {
    // Stack-Pointer Based Loads
    c_lwsp:  (inst) => buildI(0x03, 2, (inst >> 7) & 0x1F, 2, ((inst >> 7) & 0x20) | ((inst >> 2) & 0x1C) | ((inst << 4) & 0xC0)),
    c_ldsp:  (inst) => buildI(0x03, 3, (inst >> 7) & 0x1F, 2, ((inst >> 7) & 0x20) | ((inst >> 2) & 0x18) | ((inst << 4) & 0x1C0)),
    c_flwsp: (inst) => buildI(0x07, 2, (inst >> 7) & 0x1F, 2, ((inst >> 7) & 0x20) | ((inst >> 2) & 0x1C) | ((inst << 4) & 0xC0)),
    c_fldsp: (inst) => buildI(0x07, 3, (inst >> 7) & 0x1F, 2, ((inst >> 7) & 0x20) | ((inst >> 2) & 0x18) | ((inst << 4) & 0x1C0)),
    c_lqsp:  null, // RV128 only
    // Stack-Pointer Based Stores
    c_swsp:  (inst) => buildS(0x23, 2, 2, (inst >> 2) & 0x1F, ((inst >> 7) & 0x3C) | ((inst >> 1) & 0xC0)),
    c_sdsp:  (inst) => buildS(0x23, 3, 2, (inst >> 2) & 0x1F, ((inst >> 7) & 0x38) | ((inst >> 1) & 0x1C0)),
    c_fswsp: (inst) => buildS(0x27, 2, 2, (inst >> 2) & 0x1F, ((inst >> 7) & 0x3C) | ((inst >> 1) & 0xC0)),
    c_fsdsp: (inst) => buildS(0x27, 3, 2, (inst >> 2) & 0x1F, ((inst >> 7) & 0x38) | ((inst >> 1) & 0x1C0)),
    c_sqsp:  null, // RV128 only
    // Register-Based Loads (rs1'l + offset)
    c_lw:    (inst) => buildI(0x03, 2, 8 + ((inst >> 2) & 0x7), 8 + ((inst >> 7) & 0x7), ((inst >> 7) & 0x38) | ((inst >> 4) & 0x04) | ((inst << 1) & 0x40)),
    c_ld:    (inst) => buildI(0x03, 3, 8 + ((inst >> 2) & 0x7), 8 + ((inst >> 7) & 0x7), ((inst >> 7) & 0x38) | ((inst << 1) & 0xC0)),
    c_flw:   (inst) => buildI(0x07, 2, 8 + ((inst >> 2) & 0x7), 8 + ((inst >> 7) & 0x7), ((inst >> 7) & 0x38) | ((inst >> 4) & 0x04) | ((inst << 1) & 0x40)),
    c_fld:   (inst) => buildI(0x07, 3, 8 + ((inst >> 2) & 0x7), 8 + ((inst >> 7) & 0x7), ((inst >> 7) & 0x38) | ((inst << 1) & 0xC0)),
    c_lq:    null, // RV128 only
    // Register-Based Stores (rs1' + offset)
    c_sw:    (inst) => buildS(0x23, 2, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 2) & 0x7), ((inst >> 7) & 0x38) | ((inst >> 4) & 0x04) | ((inst << 1) & 0x40)),
    c_sd:    (inst) => buildS(0x23, 3, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 2) & 0x7), ((inst >> 7) & 0x38) | ((inst << 1) & 0xC0)),
    c_fsw:   (inst) => buildS(0x27, 2, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 2) & 0x7), ((inst >> 7) & 0x38) | ((inst >> 4) & 0x04) | ((inst << 1) & 0x40)),
    c_fsd:   (inst) => buildS(0x27, 3, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 2) & 0x7), ((inst >> 7) & 0x38) | ((inst << 1) & 0xC0)),
    c_sq:    null  // RV128 only
  },
  // ==========================================
  // MATH AND LOGIC
  // ==========================================
  MathLogic: {
    // Immediate Arithmetic
    c_addi4spn: (inst) => buildI(0x13, 0, 8 + ((inst >> 2) & 0x7), 2, ((inst >> 7) & 0x30) | ((inst >> 2) & 0x08) | ((inst >> 4) & 0x04) | ((inst >> 1) & 0x3C0)),
    c_addi:     (inst) => buildI(0x13, 0, (inst >> 7) & 0x1F, (inst >> 7) & 0x1F, ((inst >> 2) & 0x1F) | (((inst >> 12) & 1) ? ~0x1F : 0)),
    c_addiw:    (inst) => buildI(0x1B, 0, (inst >> 7) & 0x1F, (inst >> 7) & 0x1F, ((inst >> 2) & 0x1F) | (((inst >> 12) & 1) ? ~0x1F : 0)),
    c_addi16sp: (inst) => buildI(0x13, 0, 2, 2, ((inst >> 2) & 0x10) | ((inst << 3) & 0x20) | ((inst << 1) & 0x40) | ((inst << 4) & 0x180) | (((inst >> 12) & 1) ? ~0x1FF : 0)),
   
    // Constants
    c_li:       (inst) => buildI(0x13, 0, (inst >> 7) & 0x1F, 0, ((inst >> 2) & 0x1F) | (((inst >> 12) & 1) ? ~0x1F : 0)),
    c_lui:      (inst) => buildU(0x37, (inst >> 7) & 0x1F, ((inst << 10) & 0x1F000) | (((inst >> 12) & 1) ? ~0x1FFFF : 0)),
   
    // Shifts (Immediate)
    c_slli:     (inst) => buildI(0x13, 1, (inst >> 7) & 0x1F, (inst >> 7) & 0x1F, ((inst >> 2) & 0x1F) | (((inst >> 12) & 1) << 5)),
    c_srli:     (inst) => buildI(0x13, 5, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 7) & 0x7), ((inst >> 2) & 0x1F) | (((inst >> 12) & 1) << 5)),
    c_srai:     (inst) => buildI(0x13, 5, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 7) & 0x7), 0x400 | ((inst >> 2) & 0x1F) | (((inst >> 12) & 1) << 5)),
   
    // Bitwise / Register Arithmetic
    c_andi:     (inst) => buildI(0x13, 7, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 7) & 0x7), ((inst >> 2) & 0x1F) | (((inst >> 12) & 1) ? ~0x1F : 0)),
    c_add:      (inst) => buildR(0x33, 0, 0, (inst >> 7) & 0x1F, (inst >> 7) & 0x1F, (inst >> 2) & 0x1F),
    c_addw:     (inst) => buildR(0x3B, 0, 0, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 2) & 0x7)),
    c_sub:      (inst) => buildR(0x33, 0, 0x20, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 2) & 0x7)),
    c_subw:     (inst) => buildR(0x3B, 0, 0x20, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 2) & 0x7)),
    c_and:      (inst) => buildR(0x33, 7, 0, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 2) & 0x7)),
    c_or:       (inst) => buildR(0x33, 6, 0, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 2) & 0x7)),
    c_xor:      (inst) => buildR(0x33, 4, 0, 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 7) & 0x7), 8 + ((inst >> 2) & 0x7))
  },
  // ==========================================
  // CONTROL FLOW
  // ==========================================
  Control: {
    // Unconditional Jumps
    c_j:    (inst) => buildJ(0x6F, 0, ((inst >> 1) & 0x800) | ((inst << 2) & 0x400) | ((inst >> 1) & 0x300) | ((inst << 1) & 0x80) | ((inst >> 1) & 0x40) | ((inst << 3) & 0x20) | ((inst >> 7) & 0x10) | ((inst >> 2) & 0x0E) | (((inst >> 12) & 1) ? ~0xFFF : 0)),
    c_jal:  (inst) => buildJ(0x6F, 1, ((inst >> 1) & 0x800) | ((inst << 2) & 0x400) | ((inst >> 1) & 0x300) | ((inst << 1) & 0x80) | ((inst >> 1) & 0x40) | ((inst << 3) & 0x20) | ((inst >> 7) & 0x10) | ((inst >> 2) & 0x0E) | (((inst >> 12) & 1) ? ~0xFFF : 0)),
    c_jr:   (inst) => buildI(0x67, 0, 0, (inst >> 7) & 0x1F, 0),
    c_jalr: (inst) => buildI(0x67, 0, 1, (inst >> 7) & 0x1F, 0),
   
    // Conditional Branches
    c_beqz: (inst) => buildB(0x63, 0, 8 + ((inst >> 7) & 0x7), 0, ((inst >> 4) & 0x100) | ((inst << 1) & 0xC0) | ((inst << 3) & 0x20) | ((inst >> 7) & 0x18) | ((inst >> 2) & 0x06) | (((inst >> 12) & 1) ? ~0x1FF : 0)),
    c_bnez: (inst) => buildB(0x63, 1, 8 + ((inst >> 7) & 0x7), 0, ((inst >> 4) & 0x100) | ((inst << 1) & 0xC0) | ((inst << 3) & 0x20) | ((inst >> 7) & 0x18) | ((inst >> 2) & 0x06) | (((inst >> 12) & 1) ? ~0x1FF : 0))  
},

  // ==========================================
  // MISCELLANEOUS
  // ==========================================
  Misc: {
    c_mv:     (inst) => buildR(0x33, 0, 0, (inst >> 7) & 0x1F, 0, (inst >> 2) & 0x1F),
    c_nop:    (inst) => buildI(0x13, 0, 0, 0, 0),
    c_ebreak: (inst) => buildI(0x73, 0, 0, 0, 1)
  }
};

// ============================================================================
// SYSTEM: BASE ENVIRONMENT & FENCES
// ============================================================================

$.System.Base = {
  // ecall and ebreak don't do math or memory. They return a control object
  // that tells your main CPU loop to pause execution and handle a trap.
  ecall: (pc) => ({ 
    isTrap: true, 
    cause: 'ecall', 
    ret_pc: pc 
  }),
  
  ebreak: (pc) => ({ 
    isTrap: true, 
    cause: 'ebreak', 
    ret_pc: pc 
  }),

  // Memory Fences are essentially NOPs in a single-threaded JS emulator.
  fence: () => ({ isFence: true }),

  // ==========================================
  // TRAP AND EXCEPTION HANDLING
  // ==========================================
// Inside $.System:
Trap: {
  // Standard RISC-V Exception Codes (mcause values)
  Exceptions: {
    InstAddrMisaligned: 0n,
    InstAccessFault: 1n,
    IllegalInst: 2n,
    Breakpoint: 3n,
    LoadAddrMisaligned: 4n,
    LoadAccessFault: 5n,
    StoreAMOAddrMisaligned: 6n,
    StoreAMOAccessFault: 7n,
    EnvCallUMode: 8n,
    EnvCallSMode: 9n,
    EnvCallMMode: 11n,
    InstPageFault: 12n,
    LoadPageFault: 13n,
    StoreAMOPageFault: 15n
  },

  // Standard RISC-V Interrupt Codes (mcause values when MSB is 1)
  Interrupts: {
    SupervisorSoftware: 1n,
    MachineSoftware: 3n,
    SupervisorTimer: 5n,
    MachineTimer: 7n,
    SupervisorExternal: 9n,
    MachineExternal: 11n
  },

  // Trigger a trap and transition state to the handler
  trigger: function(cause, epc, tval, is_interrupt = false) {
    let State = RV64IMAFDGCCPU.State;
    let mstatus = State.csr.get(0x300) || 0n;
    let mtvec   = State.csr.get(0x305) || 0n;

    // 1. Set mcause (MSB is 1 for interrupts, 0 for exceptions)
    let cause_val = BigInt(cause);
    if (is_interrupt) {
      cause_val |= (1n << 63n); 
    }
    State.csr.set(0x342, cause_val);

    // 2. Save the PC where the trap occurred
    State.csr.set(0x341, BigInt(epc));

    // 3. Save trap-specific info (faulting address or instruction)
    State.csr.set(0x343, BigInt(tval));

    // 4. Update mstatus
    // - Extract current MIE (Machine Interrupt Enable) at bit 3
    // - Move MIE into MPIE (Machine Previous Interrupt Enable) at bit 7
    // - Clear MIE (Disable interrupts while in the handler)
    // - Set MPP (Machine Previous Privilege) at bits 11:12 to 3 (M-Mode)
    let mie = (mstatus >> 3n) & 1n;   
    mstatus = mstatus & ~(1n << 3n);  // Clear MIE
    mstatus = mstatus & ~(1n << 7n);  // Clear MPIE
    mstatus = mstatus | (mie << 7n);  // MPIE = old MIE
    mstatus = mstatus | (3n << 11n);  // MPP = 3 (Machine mode)
    State.csr.set(0x300, mstatus);

    // 5. Calculate next PC based on mtvec
    let base = mtvec & ~3n;
    let mode = mtvec & 3n;

    // Mode 1 (Vectored) only applies to asynchronous interrupts
    if (is_interrupt && mode === 1n) {
      State.pc = base + (4n * cause_val);
    } else {
      // Mode 0 (Direct) or synchronous exceptions
      State.pc = base;
    }
  },

  // Return from a Machine-mode trap
  mret: function() {
    let State = RV64IMAFDGCCPU.State;
    let mstatus = State.csr.get(0x300) || 0n;
    
    // 1. Restore PC from mepc
    State.pc = State.csr.get(0x341) || 0n;

    // 2. Update mstatus
    // - Move MPIE (bit 7) back to MIE (bit 3)
    // - Set MPIE to 1
    // - Set MPP (bits 11:12) to User mode (0)
    let mpie = (mstatus >> 7n) & 1n;
    mstatus = mstatus & ~(1n << 3n);  // Clear MIE
    mstatus = mstatus | (mpie << 3n); // MIE = old MPIE
    mstatus = mstatus | (1n << 7n);   // MPIE = 1
    mstatus = mstatus & ~(3n << 11n); // MPP = 0 (User mode)
    State.csr.set(0x300, mstatus);
  }
}
};

$.System.Zifencei = {
  // Instruction fence: Used to flush the instruction cache if you implement 
  // self-modifying code or JIT caching in your CPU loop later.
  fence_i: () => ({ isFenceI: true })
};

// ============================================================================
// SYSTEM: Zicsr (CONTROL AND STATUS REGISTERS)
// ============================================================================

// Safely reads a CSR. If it hasn't been written to yet, it returns 0n.
function read_csr(csr_addr) {
  return $.State.csr.get(csr_addr) || 0n;
}

// Safely writes a 64-bit value to a CSR, ensuring it stays BigInt.
function write_csr(csr_addr, val) {
  $.State.csr.set(csr_addr, BigInt.asUintN(64, val));
}

$.System.Zicsr = {
  // ==========================================
  // HARDWARE PERMISSION ENFORCER
  // ==========================================
  // ==========================================
  // HARDWARE PERMISSION ENFORCER
  // ==========================================
  checkPermissions: function(csr_addr, is_write) {
    let State = $.State; // Assuming $ is your root object
    
    // Extract minimum privilege required (Bits 9:8)
    // 00 = User, 01 = Supervisor, 11 = Machine
    let req_prv = (csr_addr >> 8) & 0x3;
    
    // Extract read-only status (Bits 11:10 === 3 means Read-Only)
    let is_read_only = ((csr_addr >> 10) & 0x3) === 0x3;

    // 1. Privilege Level Check
    if (State.prv < BigInt(req_prv)) {
        // Attempting to access a CSR above current privilege level
        $.MMU.triggerTrap(2n, $.State.pc, false); // Illegal Instruction Trap
        throw new Error("TRAP_RAISED");
    }

    // 2. Read-Only Write Check
    if (is_write && is_read_only) {
        // Attempting to write to a read-only CSR
        $.MMU.triggerTrap(2n, $.State.pc, false);
        throw new Error("TRAP_RAISED");
    }
  },

  // ==========================================
  // INSTRUCTION EXECUTORS
  // ==========================================

  // csrrw: Always writes to the CSR, even if rs1 is x0
  csrrw: function(csr_addr, rs1_val) {
      this.checkPermissions(csr_addr, true); 
      let old_val = this.read(csr_addr);
      this.write(csr_addr, rs1_val);
      return old_val; 
  },

  // csrrs: Only writes if rs1 is NOT x0 (val !== 0n)
  csrrs: function(csr_addr, rs1_val) {
      let is_write = rs1_val !== 0n;
      this.checkPermissions(csr_addr, is_write);
      let old_val = this.read(csr_addr);
      if (is_write) { 
          this.write(csr_addr, old_val | rs1_val);
      }
      return old_val;
  },

  // csrrc: Only writes if rs1 is NOT x0 (val !== 0n)
  csrrc: function(csr_addr, rs1_val) {
      let is_write = rs1_val !== 0n;
      this.checkPermissions(csr_addr, is_write);
      let old_val = this.read(csr_addr);
      if (is_write) {
          this.write(csr_addr, old_val & ~rs1_val);
      }
      return old_val;
  },

  // csrrwi: Always writes to the CSR, even if zimm is 0
  csrrwi: function(csr_addr, zimm) {
      this.checkPermissions(csr_addr, true);
      let old_val = this.read(csr_addr);
      this.write(csr_addr, BigInt(zimm));
      return old_val;
  },

  // csrrsi: Only writes if immediate is NOT 0
  csrrsi: function(csr_addr, zimm) {
      let imm_val = BigInt(zimm);
      let is_write = imm_val !== 0n;
      this.checkPermissions(csr_addr, is_write);
      let old_val = this.read(csr_addr);
      if (is_write) {
          this.write(csr_addr, old_val | imm_val);
      }
      return old_val;
  },

  // csrrci: Only writes if immediate is NOT 0
  csrrci: function(csr_addr, zimm) {
      let imm_val = BigInt(zimm);
      let is_write = imm_val !== 0n;
      this.checkPermissions(csr_addr, is_write);
      let old_val = this.read(csr_addr);
      if (is_write) {
          this.write(csr_addr, old_val & ~imm_val);
      }
      return old_val;
  },
  // ==========================================
  // INTELLIGENT READ ROUTER
  // ==========================================
  read: function(addr) {
      let State = $.State; // Assuming $ is your root object
      let val = 0n;

      switch (addr) {
          // --- S-Mode Shadows ---
          case 0x100: { // sstatus (Shadow of mstatus)
              let mstatus = State.csr.get(0x300) || 0n;
              // S-mode is only allowed to see these specific bits of mstatus:
              // SIE(1), SPIE(5), UBE(6), SPP(8), FS(13:14), XS(15:16), SUM(18), MXR(19), UXL(32:33), SD(63)
              const SSTATUS_MASK = 0x80000003000DE162n;
              val = mstatus & SSTATUS_MASK;
              break;
          }
          case 0x104: // sie (Shadow of mie, filtered by mideleg)
              val = (State.csr.get(0x304) || 0n) & (State.csr.get(0x303) || 0n);
              break;
          case 0x144: // sip (Shadow of mip, filtered by mideleg)
              val = (State.csr.get(0x344) || 0n) & (State.csr.get(0x303) || 0n);
              break;

          // --- FPU Composite Registers ---
          case 0x003: { // fcsr (Contains frm and fflags)
              let fflags = State.csr.get(0x001) || 0n;
              let frm = State.csr.get(0x002) || 0n;
              val = (frm << 5n) | fflags;
              break;
          }

          // --- Hardware Timers ---
          case 0xC00: // cycle
          case 0xC01: // time
          case 0xC02: // instret
              // In a real emulator, these map to your main execution loop counter.
              // We will map time to JS Date.now() as a placeholder.
              val = BigInt(Date.now()); 
              break;

          // --- Standard Registers ---
          default:
              val = State.csr.get(addr) || 0n;
              break;
      }
      return val;
  },

  // ==========================================
  // INTELLIGENT WRITE ROUTER
  // ==========================================
  write: function(addr, val) {
      let State = $.State;

      switch (addr) {
          // --- S-Mode Shadows ---
          case 0x100: { // sstatus
              let mstatus = State.csr.get(0x300) || 0n;
              const SSTATUS_MASK = 0x80000003000DE162n;
              // Clear the S-visible bits in mstatus, then OR the new S-visible bits
              mstatus = (mstatus & ~SSTATUS_MASK) | (val & SSTATUS_MASK);
              State.csr.set(0x300, mstatus);
              break;
          }
          case 0x104: { // sie
              let mie = State.csr.get(0x304) || 0n;
              let mideleg = State.csr.get(0x303) || 0n;
              // S-mode can only modify interrupts that M-mode delegated to it
              mie = (mie & ~mideleg) | (val & mideleg);
              State.csr.set(0x304, mie);
              break;
          }
          case 0x144: { // sip
              let mip = State.csr.get(0x344) || 0n;
              let mideleg = State.csr.get(0x303) || 0n;
              mip = (mip & ~mideleg) | (val & mideleg);
              State.csr.set(0x344, mip);
              break;
          }

          // --- FPU Composite Registers ---
          case 0x003: // fcsr
              State.csr.set(0x001, val & 0x1Fn);       // Extract fflags
              State.csr.set(0x002, (val >> 5n) & 0x7n); // Extract frm
              // Writing to FCSR dirties the FPU state (mstatus.FS = 3)
              State.csr.set(0x300, (State.csr.get(0x300) || 0n) | (3n << 13n));
              break;
          case 0x001: // fflags
          case 0x002: // frm
              State.csr.set(addr, val);
              State.csr.set(0x300, (State.csr.get(0x300) || 0n) | (3n << 13n)); // Mark FS dirty
              break;

          // --- Read-Only Registers (Silently Ignore Writes) ---
          case 0xF11: // mvendorid
          case 0xF12: // marchid
          case 0xF13: // mimpid
          case 0xF14: // mhartid
          case 0xC00: // cycle
          case 0xC01: // time
          case 0xC02: // instret
              break; 

          // --- Standard M-Mode Registers ---
          default:
              // For all standard registers (mepc, mtvec, satp, mscratch, etc.)
              State.csr.set(addr, val);
              break;
      }
  }

  // ==========================================
  // INSTRUCTION EXECUTORS
  // ==========================================
};

$.State.prv = 3n; // Start in Machine mode (3=M, 1=S, 0=U)
$.State.tlb = new Map();

class UART16550 {

  constructor() {

      // Essential registers

      this.ier = 0;    // Interrupt Enable Register

      this.lcr = 0;    // Line Control Register

      

      // LSR: Line Status Register. 

      // 0x20 = Transmitter Holding Register Empty (Ready to accept new data)

      // 0x40 = Transmitter Empty (All data sent)

      // The OS checks this to know if it's safe to send a character!

      this.lsr = 0x60; 

      

      this.outBuffer = "";

  }

  read(offset) {

      switch (offset) {

          case 0: return 0;       // RX Buffer (Input empty for now)

          case 1: return this.ier;

          case 2: return 0xC1;    // Interrupt Identification (0xC1 = No interrupt pending, FIFOs enabled)

          case 3: return this.lcr;

          case 5: return this.lsr;

          default: return 0;

      }

  }

  write(offset, value) {

      value = Number(value) & 0xFF; // UART registers are 8-bit

      

      switch (offset) {

          case 0: 

              // Offset 0 is the THR (Transmit Holding Register).

              // Writing to this offset prints a character.

              if (value === 10) { // Newline character '\n'

                  console.log(`[UART] ${this.outBuffer}`);

                  this.outBuffer = "";

              } else {

                  this.outBuffer += String.fromCharCode(value);

              }

              break;

          case 1: this.ier = value; break;

          case 3: this.lcr = value; break;

      }

  }

}

class CLINT {
    constructor() {
        this.mtime = 0n;
        this.mtimecmp = 0xFFFFFFFFFFFFFFFFn; // Max value initially (prevents immediate interrupt)
        this.msip = 0n;                      // Machine Software Interrupt Pending
    }
    read(offset) {
        if (offset === 0x0000n) return this.msip;
        if (offset === 0x4000n) return this.mtimecmp;
        if (offset === 0xBFF8n) return this.mtime;
        return 0n;
    }
    write(offset, value) {
        if (offset === 0x0000n) {
            this.msip = BigInt(value) & 1n; // Only bit 0 matters
        } else if (offset === 0x4000n) {
            this.mtimecmp = BigInt(value);
        } else if (offset === 0xBFF8n) {
            this.mtime = BigInt(value);
        }
    }
    
    tick() {
        // In real hardware, this increments at a fixed frequency (e.g., 10 MHz RTC).
        // For emulation, advancing it by 1 per CPU step works perfectly fine.
        this.mtime += 1n;
        let mip_bits = 0n;
        // Check for Software Interrupt
        if (this.msip !== 0n) {
            mip_bits |= (1n << 3n); // Set bit 3 for MSI
        }
        // Check for Timer Interrupt
        if (this.mtime >= this.mtimecmp) {
            mip_bits |= (1n << 7n); // Set bit 7 for MTI
        }
        return mip_bits; // Return the pending interrupt bits
    }
}
class VirtioBlock {
    constructor(diskImageArrayBuffer, memory) {
        this.disk = new Uint8Array(diskImageArrayBuffer); 
        this.mem = memory; 
        // VirtIO MMIO Registers
        this.MagicValue = 0x74726976; 
        this.Version = 2;             
        this.DeviceID = 2;            
        this.VendorID = 0x554D4551;   
        this.DeviceFeatures = 0n;     
        this.DeviceFeaturesSel = 0;
        this.DriverFeatures = 0n;
        this.DriverFeaturesSel = 0;
        this.QueueSel = 0;
        this.QueueNumMax = 8;         
        this.QueueNum = 0;
        this.QueueReady = 0;
        this.QueueDesc = 0n;
        this.QueueDriver = 0n;
        this.QueueDevice = 0n;
        this.Status = 0;
        this.ConfigGeneration = 0;
        this.lastAvailIdx = 0;
        this.InterruptStatus = 0; // Bit 0: Used Ring Update, Bit 1: Config Change
    }
    read(offset) {
        switch (offset) {
            case 0x000: return this.MagicValue;
            case 0x004: return this.Version;
            case 0x008: return this.DeviceID;
            case 0x00C: return this.VendorID;
            case 0x010: return Number((this.DeviceFeatures >> BigInt(this.DeviceFeaturesSel * 32)) & 0xFFFFFFFFn);
            case 0x034: return this.QueueNumMax;
            case 0x044: return this.QueueReady;
            case 0x060: return this.InterruptStatus; // <-- Updated: IRQ Status
            case 0x070: return this.Status;
            case 0x0FC: return this.ConfigGeneration; // <-- Moved to correct offset
            case 0x100: // Config space (Capacity)
                const capacity = BigInt(this.disk.length / 512);
                return Number(capacity & 0xFFFFFFFFn);
            case 0x104: 
                return Number((BigInt(this.disk.length / 512) >> 32n) & 0xFFFFFFFFn);
            default: return 0;
        }
    }
    write(offset, value) {
        const val32 = Number(value) >>> 0;
        switch (offset) {
            case 0x014: this.DeviceFeaturesSel = val32; break;
            case 0x020: 
                if (this.DriverFeaturesSel === 0) {
                    this.DriverFeatures = (this.DriverFeatures & ~0xFFFFFFFFn) | BigInt(val32);
                } else {
                    this.DriverFeatures = (this.DriverFeatures & 0xFFFFFFFFn) | (BigInt(val32) << 32n);
                }
                break;
            case 0x024: this.DriverFeaturesSel = val32; break;
            case 0x030: this.QueueSel = val32; break;
            case 0x038: this.QueueNum = val32; break;
            case 0x044: this.QueueReady = val32; break;
            case 0x050: this.QueueNotify(val32); break; 
            case 0x064: // <-- Added: Interrupt ACK
                this.InterruptStatus &= ~val32; 
                break;
            case 0x070: this.Status = val32; break;
            case 0x080: this.QueueDesc = (this.QueueDesc & ~0xFFFFFFFFn) | BigInt(val32); break;
            case 0x084: this.QueueDesc = (this.QueueDesc & 0xFFFFFFFFn) | (BigInt(val32) << 32n); break;
            case 0x090: this.QueueDriver = (this.QueueDriver & ~0xFFFFFFFFn) | BigInt(val32); break;
            case 0x094: this.QueueDriver = (this.QueueDriver & 0xFFFFFFFFn) | (BigInt(val32) << 32n); break;
            case 0x0A0: this.QueueDevice = (this.QueueDevice & ~0xFFFFFFFFn) | BigInt(val32); break;
            case 0x0A4: this.QueueDevice = (this.QueueDevice & 0xFFFFFFFFn) | (BigInt(val32) << 32n); break;
        }
    }
    QueueNotify(queueIndex) {
        if (queueIndex !== 0) return; // Block devices only use queue 0
        // The Available Ring index is at offset 2 in the QueueDriver memory area
        const availIdx = this.mem.readU16(this.QueueDriver + 2n);
        // Process all pending requests
        while (this.lastAvailIdx !== availIdx) {
            // The ring elements start at offset 4. Each is a 16-bit descriptor index.
            const ringOffset = 4n + BigInt(this.lastAvailIdx % this.QueueNum) * 2n;
            const descHead = this.mem.readU16(this.QueueDriver + ringOffset);
            this.processRequest(descHead);
            this.lastAvailIdx = (this.lastAvailIdx + 1) & 0xFFFF; // 16-bit wrap
        }
        // Trigger an interrupt so Linux knows the disk I/O is done
        this.InterruptStatus |= 1; // Bit 0: Used Ring Update
    }
    processRequest(descHead) {
        // Helper function to read a 16-byte Descriptor from physical memory
        const readDesc = (index) => {
            const addr = this.QueueDesc + BigInt(index) * 16n;
            return {
                addr: this.mem.readU64(addr),
                len: this.mem.readU32(addr + 8n),
                flags: this.mem.readU16(addr + 12n),
                next: this.mem.readU16(addr + 14n)
            };
        };
        // Standard VirtIO Block requests are chained in 3 parts:
        const desc0 = readDesc(descHead);   // 1. Header (Type, Sector)
        const desc1 = readDesc(desc0.next); // 2. Data Payload
        const desc2 = readDesc(desc1.next); // 3. Status Byte
        // Parse the Header (Type is a 32-bit int, Sector is a 64-bit int)
        const type = this.mem.readU32(desc0.addr);
        const sector = this.mem.readU64(desc0.addr + 8n);
        const diskOffset = Number(sector) * 512;
        // Perform the Disk I/O
        if (type === 0) { 
            // VIRTIO_BLK_T_IN (Read Disk -> RAM)
            for (let i = 0; i < desc1.len; i++) {
                this.mem.write8(desc1.addr + BigInt(i), this.disk[diskOffset + i]);
            }
        } else if (type === 1) { 
            // VIRTIO_BLK_T_OUT (Write RAM -> Disk)
            for (let i = 0; i < desc1.len; i++) {
                this.disk[diskOffset + i] = this.mem.readU8(desc1.addr + BigInt(i));
            }
        }
        // Write the Status Byte (0 = VIRTIO_BLK_S_OK)
        this.mem.write8(desc2.addr, 0);
        // Update the Used Ring so Linux knows this specific request is finished
        const usedIdx = this.mem.readU16(this.QueueDevice + 2n);
        const usedRingOffset = 4n + BigInt(usedIdx % this.QueueNum) * 8n;
        
        // Write ID (4 bytes) and Length written (4 bytes)
        this.mem.write32(this.QueueDevice + usedRingOffset, descHead);
        
        const writtenLen = (type === 0) ? desc1.len + 1 : 1; 
        this.mem.write32(this.QueueDevice + usedRingOffset + 4n, writtenLen);
        // Increment the Used Ring index
        this.mem.write16(this.QueueDevice + 2n, usedIdx + 1);
    }
}

const RVALUATION64 = {
  cpu: $,
  memory: null,

  Decode: {
      opcode: (inst) => inst & 0x7F,
      rd:     (inst) => (inst >> 7) & 0x1F,
      funct3: (inst) => (inst >> 12) & 0x7,
      rs1:    (inst) => (inst >> 15) & 0x1F,
      rs2:    (inst) => (inst >> 20) & 0x1F,
      funct7: (inst) => (inst >>> 25) & 0x7F,
      rs3:    (inst) => (inst >> 27) & 0x1F, // Specifically for Fused-Multiply Add (FMA)

      // Immediates
      imm_I: (inst) => BigInt(inst >> 20),
      imm_S: (inst) => BigInt((inst >> 25 << 5) | ((inst >> 7) & 0x1F)),
      imm_B: (inst) => BigInt(
          ((inst >> 31) << 12) | 
          (((inst >> 7) & 1) << 11) | 
          (((inst >> 25) & 0x3F) << 5) | 
          (((inst >> 8) & 0xF) << 1)
      ),
      imm_U: (inst) => BigInt(inst & 0xFFFFF000), 
      imm_J: (inst) => BigInt(
          ((inst >> 31) << 20) | 
          (((inst >> 12) & 0xFF) << 12) | 
          (((inst >> 20) & 1) << 11) | 
          (((inst >> 21) & 0x3FF) << 1)
      )
  },

  // ==========================================
  // COMPLETE RISC-V OPCODE DISPATCH TABLE
  // ==========================================
  Opcodes: {
      // ----------------------------------------
      // BASE INTEGER (RV32I / RV64I)
      // ----------------------------------------
      BASE_INTEGER: {
        0x37: null, // LUI    (Load Upper Immediate)
        0x17: null, // AUIPC  (Add Upper Immediate to PC)
        0x6F: null, // JAL    (Jump and Link)
        0x67: null, // JALR   (Jump and Link Register)
        0x63: null, // BRANCH (BEQ, BNE, BLT, BGE, BLTU, BGEU)
        0x03: null, // LOAD   (LB, LH, LW, LD, LBU, LHU, LWU)
        0x23: null, // STORE  (SB, SH, SW, SD)
        0x13: null, // OP-IMM (ADDI, SLTI, SLTIU, XORI, ORI, ANDI, SLLI, SRLI, SRAI)
        0x33: null, // OP     (ADD, SUB, SLL, SLT, SLTU, XOR, SRL, SRA, OR, AND) 
                    //        -> Also includes 'M' Extension (MUL, DIV, REM)
      },

      // ----------------------------------------
      // RV64I SPECIFIC (32-bit operations)
      // ----------------------------------------
      RV64I_SPECIFIC: {
      0x1B: null, // OP-IMM-32 (ADDIW, SLLIW, SRLIW, SRAIW)
      0x3B: null, // OP-32     (ADDW, SUBW, SLLW, SRLW, SRAW) 
                  //           -> Also includes 'M' Ext (MULW, DIVW, REMW)
      },
      // ----------------------------------------
      // ATOMICS (A Extension)
      // ----------------------------------------
      ATOMICS: {
      0x2F: null, // AMO (LR, SC, AMOSWAP, AMOADD, AMOXOR, AMOAND, AMOOR, AMOMIN, AMOMAX, AMOMINU, AMOMAXU)
      },
      // ----------------------------------------
      // FLOATING POINT (F & D Extensions)
      // ----------------------------------------
      FLOATING_POINT: {
      0x07: null, // LOAD-FP  (FLW, FLD)
      0x27: null, // STORE-FP (FSW, FSD)
      0x43: null, // FMADD    (FMADD.S, FMADD.D)
      0x47: null, // FMSUB    (FMSUB.S, FMSUB.D)
      0x4B: null, // FNMSUB   (FNMSUB.S, FNMSUB.D)
      0x4F: null, // FNMADD   (FNMADD.S, FNMADD.D)
      0x53: null, // OP-FP    (FADD, FSUB, FMUL, FDIV, FSQRT, FSGNJ, FMIN, FMAX, FCVT, FMV, FEQ, FLT, FLE, FCLASS)
      },
      // ----------------------------------------
      // SYSTEM & MEMORY (Zicsr, Zifencei, Privileged)
      // ----------------------------------------
      SYSTEM$MEMORY: {
      0x0F: null, // MISC-MEM (FENCE, FENCE.I)
      0x73: null, // SYSTEM   (ECALL, EBREAK, CSRRW, CSRRS, CSRRC, CSRRWI, CSRRSI, CSRRCI, MRET, SRET)
      }
    }
};

RVALUATION64.Opcodes.BASE_INTEGER = {
  // ----------------------------------------
  // BASE INTEGER (RV32I / RV64I)
  // ----------------------------------------

  // LUI (Load Upper Immediate)
  0x37: function(inst) {
      let rd = this.Decode.rd(inst);
      let imm = this.Decode.imm_U(inst);
      if (rd !== 0) {
          this.cpu.State.x_ram[rd] = this.cpu.ALU.Base.lui(imm);
      }
      this.cpu.State.pc += 4n;
  },

  // AUIPC (Add Upper Immediate to PC)
  0x17: function(inst) {
      let rd = this.Decode.rd(inst);
      let imm = this.Decode.imm_U(inst);
      if (rd !== 0) {
          this.cpu.State.x_ram[rd] = this.cpu.ALU.Base.auipc(this.cpu.State.pc, imm);
      }
      this.cpu.State.pc += 4n;
  },

  // JAL (Jump and Link)
  0x6F: function(inst) {
      let rd = this.Decode.rd(inst);
      let imm = this.Decode.imm_J(inst);
      
      let res = this.cpu.ALU.Jumps.jal(this.cpu.State.pc, imm);
      
      if (rd !== 0) this.cpu.State.x_ram[rd] = res.rd_val;
      this.cpu.State.pc = res.new_pc; // Note: We do NOT add 4 here, the jump sets the PC!
  },

  // JALR (Jump and Link Register)
  0x67: function(inst) {
      let rd = this.Decode.rd(inst);
      let rs1 = this.Decode.rs1(inst);
      let imm = this.Decode.imm_I(inst);
      let rs1_val = this.cpu.State.x_ram[rs1];
      
      let res = this.cpu.ALU.Jumps.jalr(this.cpu.State.pc, rs1_val, imm);
      
      if (rd !== 0) this.cpu.State.x_ram[rd] = res.rd_val;
      this.cpu.State.pc = res.new_pc;
  },

  // BRANCH (BEQ, BNE, BLT, BGE, BLTU, BGEU)
  0x63: function(inst) {
      let funct3 = this.Decode.funct3(inst);
      let rs1 = this.Decode.rs1(inst);
      let rs2 = this.Decode.rs2(inst);
      let imm = this.Decode.imm_B(inst);
      
      let rs1_val = this.cpu.State.x_ram[rs1];
      let rs2_val = this.cpu.State.x_ram[rs2];
      let taken = false;

      switch (funct3) {
          case 0x0: taken = this.cpu.ALU.Branches.beq(rs1_val, rs2_val); break;
          case 0x1: taken = this.cpu.ALU.Branches.bne(rs1_val, rs2_val); break;
          case 0x4: taken = this.cpu.ALU.Branches.blt(rs1_val, rs2_val); break;
          case 0x5: taken = this.cpu.ALU.Branches.bge(rs1_val, rs2_val); break;
          case 0x6: taken = this.cpu.ALU.Branches.bltu(rs1_val, rs2_val); break;
          case 0x7: taken = this.cpu.ALU.Branches.bgeu(rs1_val, rs2_val); break;
          default: throw new Error(`Invalid BRANCH funct3: ${funct3}`);
      }

      if (taken) {
          this.cpu.State.pc += imm;
      } else {
          this.cpu.State.pc += 4n;
      }
  },

  // LOAD (LB, LH, LW, LD, LBU, LHU, LWU)
  0x03: function(inst) {
    let rd = this.Decode.rd(inst);
    let rs1 = this.Decode.rs1(inst);
    let funct3 = this.Decode.funct3(inst);
    let imm = this.Decode.imm_I(inst);
    let rs1_val = this.cpu.State.x_ram[rs1];
    
    let loadOp;
    switch (funct3) {
        case 0x0: loadOp = this.cpu.LSU.Base.lb(rs1_val, imm); break;
        case 0x1: loadOp = this.cpu.LSU.Base.lh(rs1_val, imm); break;
        case 0x2: loadOp = this.cpu.LSU.Base.lw(rs1_val, imm); break;
        case 0x3: loadOp = this.cpu.LSU.Base.ld(rs1_val, imm); break;
        case 0x4: loadOp = this.cpu.LSU.Base.lbu(rs1_val, imm); break;
        case 0x5: loadOp = this.cpu.LSU.Base.lhu(rs1_val, imm); break;
        case 0x6: loadOp = this.cpu.LSU.Base.lwu(rs1_val, imm); break;
        default: this.MMU.triggerTrap(2n, BigInt(inst), false); return; // Illegal Instruction
    }

    // 1. Map byte count to the MMU size string
    let sizeStr = loadOp.bytes === 1 ? '8' : 
                  loadOp.bytes === 2 ? '16' : 
                  loadOp.bytes === 4 ? '32' : '64';

    // 2. Interface with the MMU (this correctly handles page faults and MMIO)
    // If a page fault happens, this.MMU.read throws "TRAP_RAISED" and aborts the instruction automatically!
    if (rd !== 0) {
        let val = this.MMU.read(loadOp.addr, sizeStr);
        
        // 3. Sign extension for signed loads (lb, lh, lw, ld)
        if (loadOp.signed) {
            val = BigInt.asIntN(loadOp.bytes * 8, val);
        }
        
        this.cpu.State.x_ram[rd] = val;
    }
    
    this.cpu.State.pc += 4n;
  },

  // STORE (SB, SH, SW, SD)
  0x23: function(inst) {
      let rs1 = this.Decode.rs1(inst);
      let rs2 = this.Decode.rs2(inst);
      let funct3 = this.Decode.funct3(inst);
      let imm = this.Decode.imm_S(inst);
      
      let rs1_val = this.cpu.State.x_ram[rs1];
      let rs2_val = this.cpu.State.x_ram[rs2];
      
      let storeOp;
      switch (funct3) {
          case 0x0: storeOp = this.cpu.LSU.Base.sb(rs1_val, rs2_val, imm); break;
          case 0x1: storeOp = this.cpu.LSU.Base.sh(rs1_val, rs2_val, imm); break;
          case 0x2: storeOp = this.cpu.LSU.Base.sw(rs1_val, rs2_val, imm); break;
          case 0x3: storeOp = this.cpu.LSU.Base.sd(rs1_val, rs2_val, imm); break;
          default: this.MMU.triggerTrap(2n, BigInt(inst), false); return; // Illegal Instruction
      }

      // Map byte count to MMU size string
      let sizeStr = storeOp.bytes === 1 ? '8' : 
                    storeOp.bytes === 2 ? '16' : 
                    storeOp.bytes === 4 ? '32' : '64';

      // Interface with the MMU
      this.MMU.write(storeOp.addr, sizeStr, storeOp.value);
      
      this.cpu.State.pc += 4n;
  },

  // OP-IMM (Immediate Arithmetic)
  0x13: function(inst) {
      let rd = this.Decode.rd(inst);
      let rs1 = this.Decode.rs1(inst);
      let funct3 = this.Decode.funct3(inst);
      let funct7 = this.Decode.funct7(inst);
      let imm = this.Decode.imm_I(inst);
      
      let rs1_val = this.cpu.State.x_ram[rs1];
      let result = 0n;

      switch (funct3) {
          case 0x0: result = this.cpu.ALU.Base.addi(rs1_val, imm); break;
          case 0x2: result = this.cpu.ALU.Base.slti(rs1_val, imm); break;
          case 0x3: result = this.cpu.ALU.Base.sltiu(rs1_val, imm); break;
          case 0x4: result = this.cpu.ALU.Base.xori(rs1_val, imm); break;
          case 0x6: result = this.cpu.ALU.Base.ori(rs1_val, imm); break;
          case 0x7: result = this.cpu.ALU.Base.andi(rs1_val, imm); break;
          case 0x1: result = this.cpu.ALU.Shifts.slli(rs1_val, imm & 0x3Fn); break;
          case 0x5: 
              // Differentiate SRLI and SRAI using bit 30 (which sits at bit 5 of funct7)
              if ((funct7 >> 5) & 1) {
                  result = this.cpu.ALU.Shifts.srai(rs1_val, imm & 0x3Fn);
              } else {
                  result = this.cpu.ALU.Shifts.srli(rs1_val, imm & 0x3Fn);
              }
              break;
      }

      if (rd !== 0) this.cpu.State.x_ram[rd] = result;
      this.cpu.State.pc += 4n;
  },

  // OP (Register-Register Arithmetic + 'M' Extension Math)
  0x33: function(inst) {
      let rd = this.Decode.rd(inst);
      let rs1 = this.Decode.rs1(inst);
      let rs2 = this.Decode.rs2(inst);
      let funct3 = this.Decode.funct3(inst);
      let funct7 = this.Decode.funct7(inst);
      
      let rs1_val = this.cpu.State.x_ram[rs1];
      let rs2_val = this.cpu.State.x_ram[rs2];
      let result = 0n;

      // The 'M' Extension (Multiplication/Division) is uniquely identified by funct7 === 0x01
      if (funct7 === 0x01) {
          switch (funct3) {
              case 0x0: result = this.cpu.ALU.M.mul(rs1_val, rs2_val); break;
              case 0x1: result = this.cpu.ALU.M.mulh(rs1_val, rs2_val); break;
              case 0x2: result = this.cpu.ALU.M.mulhsu(rs1_val, rs2_val); break;
              case 0x3: result = this.cpu.ALU.M.mulhu(rs1_val, rs2_val); break;
              case 0x4: result = this.cpu.ALU.M.div(rs1_val, rs2_val); break;
              case 0x5: result = this.cpu.ALU.M.divu(rs1_val, rs2_val); break;
              case 0x6: result = this.cpu.ALU.M.rem(rs1_val, rs2_val); break;
              case 0x7: result = this.cpu.ALU.M.remu(rs1_val, rs2_val); break;
          }
      } else {
          // Base Integer Operations
          // bit 30 (funct7 == 0x20) acts as a modifier flag to switch ADD->SUB or SRL->SRA
          let isModifier = (funct7 === 0x20);
          
          switch (funct3) {
              case 0x0: result = isModifier ? this.cpu.ALU.Base.sub(rs1_val, rs2_val) : this.cpu.ALU.Base.add(rs1_val, rs2_val); break;
              case 0x1: result = this.cpu.ALU.Shifts.sll(rs1_val, rs2_val); break;
              case 0x2: result = this.cpu.ALU.Base.slt(rs1_val, rs2_val); break;
              case 0x3: result = this.cpu.ALU.Base.sltu(rs1_val, rs2_val); break;
              case 0x4: result = this.cpu.ALU.Base.xor(rs1_val, rs2_val); break;
              case 0x5: result = isModifier ? this.cpu.ALU.Shifts.sra(rs1_val, rs2_val) : this.cpu.ALU.Shifts.srl(rs1_val, rs2_val); break;
              case 0x6: result = this.cpu.ALU.Base.or(rs1_val, rs2_val); break;
              case 0x7: result = this.cpu.ALU.Base.and(rs1_val, rs2_val); break;
          }
      }

      if (rd !== 0) this.cpu.State.x_ram[rd] = result;
      this.cpu.State.pc += 4n;
  }
}

RVALUATION64.Opcodes.RV64I_SPECIFIC = {
  // OP-IMM-32 (ADDIW, SLLIW, SRLIW, SRAIW)
  0x1B: function(inst) {
      let rd = this.Decode.rd(inst);
      let rs1 = this.Decode.rs1(inst);
      let funct3 = this.Decode.funct3(inst);
      let funct7 = this.Decode.funct7(inst);
      let imm = this.Decode.imm_I(inst);
      
      let rs1_val = this.cpu.State.x_ram[rs1];
      let result = 0n;

      switch (funct3) {
          case 0x0: // ADDIW
              result = this.cpu.ALU.Base.addiw(rs1_val, imm); 
              break;
          case 0x1: // SLLIW (Shift amount is lower 5 bits of imm)
              result = this.cpu.ALU.Shifts.slliw(rs1_val, imm & 0x1Fn); 
              break;
          case 0x5: // SRLIW / SRAIW (Differentiated by bit 30 / funct7)
              if ((funct7 >> 5) & 1) {
                  result = this.cpu.ALU.Shifts.sraiw(rs1_val, imm & 0x1Fn);
              } else {
                  result = this.cpu.ALU.Shifts.srliw(rs1_val, imm & 0x1Fn);
              }
              break;
          default: 
              throw new Error(`Invalid OP-IMM-32 funct3: ${funct3}`);
      }

      if (rd !== 0) this.cpu.State.x_ram[rd] = result;
      this.cpu.State.pc += 4n;
  },

  // OP-32 (ADDW, SUBW, SLLW, SRLW, SRAW + 'M' Ext 32-bit)
  0x3B: function(inst) {
      let rd = this.Decode.rd(inst);
      let rs1 = this.Decode.rs1(inst);
      let rs2 = this.Decode.rs2(inst);
      let funct3 = this.Decode.funct3(inst);
      let funct7 = this.Decode.funct7(inst);
      
      let rs1_val = this.cpu.State.x_ram[rs1];
      let rs2_val = this.cpu.State.x_ram[rs2];
      let result = 0n;

      // Check if it is the 'M' Extension (funct7 === 0x01)
      if (funct7 === 0x01) {
          switch (funct3) {
              case 0x0: result = this.cpu.ALU.M.mulw(rs1_val, rs2_val); break;
              case 0x4: result = this.cpu.ALU.M.divw(rs1_val, rs2_val); break;
              case 0x5: result = this.cpu.ALU.M.divuw(rs1_val, rs2_val); break;
              case 0x6: result = this.cpu.ALU.M.remw(rs1_val, rs2_val); break;
              case 0x7: result = this.cpu.ALU.M.remuw(rs1_val, rs2_val); break;
              default: throw new Error(`Invalid OP-32 M-ext funct3: ${funct3}`);
          }
      } else {
          // Base RV64I Operations
          // bit 30 (funct7 == 0x20) acts as a modifier flag to switch ADDW->SUBW or SRLW->SRAW
          let isModifier = (funct7 === 0x20);
          
          switch (funct3) {
              case 0x0: 
                  result = isModifier ? this.cpu.ALU.Base.subw(rs1_val, rs2_val) : this.cpu.ALU.Base.addw(rs1_val, rs2_val); 
                  break;
              case 0x1: 
                  result = this.cpu.ALU.Shifts.sllw(rs1_val, rs2_val); 
                  break;
              case 0x5: 
                  result = isModifier ? this.cpu.ALU.Shifts.sraw(rs1_val, rs2_val) : this.cpu.ALU.Shifts.srlw(rs1_val, rs2_val); 
                  break;
              default: 
                  throw new Error(`Invalid OP-32 funct3: ${funct3}`);
          }
      }

      if (rd !== 0) this.cpu.State.x_ram[rd] = result;
      this.cpu.State.pc += 4n;
  }
}

RVALUATION64.Opcodes.ATOMICS = {
  // ----------------------------------------
  // ATOMICS (A Extension)
  // ----------------------------------------
  0x2F: function(inst) {
    let rd = this.Decode.rd(inst);
    let rs1 = this.Decode.rs1(inst);
    let rs2 = this.Decode.rs2(inst);
    let funct3 = this.Decode.funct3(inst);
    let funct7 = this.Decode.funct7(inst);
    
    let funct5 = funct7 >> 2; 

    let rs1_val = this.cpu.State.x_ram[rs1];
    let rs2_val = this.cpu.State.x_ram[rs2];

    let amoOp;

    if (funct3 === 0x2) { // 32-bit (.w)
        switch (funct5) {
            case 0x02: amoOp = this.cpu.LSU.A.lr_w(rs1_val); break;
            case 0x03: amoOp = this.cpu.LSU.A.sc_w(rs1_val, rs2_val); break;
            case 0x01: amoOp = this.cpu.LSU.A.amoswap_w(rs1_val, rs2_val); break;
            case 0x00: amoOp = this.cpu.LSU.A.amoadd_w(rs1_val, rs2_val); break;
            case 0x04: amoOp = this.cpu.LSU.A.amoxor_w(rs1_val, rs2_val); break;
            case 0x0C: amoOp = this.cpu.LSU.A.amoand_w(rs1_val, rs2_val); break;
            case 0x08: amoOp = this.cpu.LSU.A.amoor_w(rs1_val, rs2_val); break;
            case 0x10: amoOp = this.cpu.LSU.A.amomin_w(rs1_val, rs2_val); break;
            case 0x14: amoOp = this.cpu.LSU.A.amomax_w(rs1_val, rs2_val); break;
            case 0x18: amoOp = this.cpu.LSU.A.amominu_w(rs1_val, rs2_val); break;
            case 0x1C: amoOp = this.cpu.LSU.A.amomaxu_w(rs1_val, rs2_val); break;
            default: this.MMU.triggerTrap(2n, BigInt(inst), false); return;
        }
    } else if (funct3 === 0x3) { // 64-bit (.d)
        switch (funct5) {
            case 0x02: amoOp = this.cpu.LSU.A.lr_d(rs1_val); break;
            case 0x03: amoOp = this.cpu.LSU.A.sc_d(rs1_val, rs2_val); break;
            case 0x01: amoOp = this.cpu.LSU.A.amoswap_d(rs1_val, rs2_val); break;
            case 0x00: amoOp = this.cpu.LSU.A.amoadd_d(rs1_val, rs2_val); break;
            case 0x04: amoOp = this.cpu.LSU.A.amoxor_d(rs1_val, rs2_val); break;
            case 0x0C: amoOp = this.cpu.LSU.A.amoand_d(rs1_val, rs2_val); break;
            case 0x08: amoOp = this.cpu.LSU.A.amoor_d(rs1_val, rs2_val); break;
            case 0x10: amoOp = this.cpu.LSU.A.amomin_d(rs1_val, rs2_val); break;
            case 0x14: amoOp = this.cpu.LSU.A.amomax_d(rs1_val, rs2_val); break;
            case 0x18: amoOp = this.cpu.LSU.A.amominu_d(rs1_val, rs2_val); break;
            case 0x1C: amoOp = this.cpu.LSU.A.amomaxu_d(rs1_val, rs2_val); break;
            default: this.MMU.triggerTrap(2n, BigInt(inst), false); return;
        }
    } else {
        this.MMU.triggerTrap(2n, BigInt(inst), false); return;
    }

    let sizeStr = amoOp.bytes === 4 ? '32' : '64';

    // --- LOAD RESERVED ---
    if (amoOp.type === 'LR') {
        let val = this.MMU.read(amoOp.addr, sizeStr);
        if (amoOp.signed) val = BigInt.asIntN(amoOp.bytes * 8, val);
        
        if (rd !== 0) this.cpu.State.x_ram[rd] = val;
        
        this.cpu.State.loadReservation.active = true;
        this.cpu.State.loadReservation.address = amoOp.addr;
        this.cpu.State.loadReservation.size = amoOp.bytes;

    // --- STORE CONDITIONAL ---
    } else if (amoOp.type === 'SC') {
        let res = this.cpu.State.loadReservation;
        
        if (res.active && res.address === amoOp.addr && res.size === amoOp.bytes) {
            this.MMU.write(amoOp.addr, sizeStr, amoOp.value);
            if (rd !== 0) this.cpu.State.x_ram[rd] = 0n; // 0 = Success
        } else {
            if (rd !== 0) this.cpu.State.x_ram[rd] = 1n; // Non-zero = Failure
        }
        this.cpu.State.loadReservation.active = false;

    // --- STANDARD ATOMIC MEMORY OPERATIONS (AMO) ---
    } else if (amoOp.type === 'AMO') {
        let old_val = this.MMU.read(amoOp.addr, sizeStr);
        
        let rd_val = amoOp.signed ? BigInt.asIntN(amoOp.bytes * 8, old_val) : old_val;
        let new_val = amoOp.op(rd_val);
        
        this.MMU.write(amoOp.addr, sizeStr, new_val);
        
        if (rd !== 0) this.cpu.State.x_ram[rd] = rd_val;
    }

    this.cpu.State.pc += 4n;
  },
};

RVALUATION64.Opcodes.FLOATING_POINT = {
  // ----------------------------------------
  // FLOATING POINT (F & D Extensions)
  // ----------------------------------------

  // LOAD-FP (FLW, FLD)
  0x07: function(inst) {
    let rd = this.Decode.rd(inst);
    let rs1 = this.Decode.rs1(inst);
    let funct3 = this.Decode.funct3(inst);
    let imm = this.Decode.imm_I(inst);
    
    let rs1_val = this.cpu.State.x_ram[rs1];
    let loadOp;
    
    if (funct3 === 0x2) {
        loadOp = this.cpu.FALU.F.flw(rs1_val, imm);
    } else if (funct3 === 0x3) {
        loadOp = this.cpu.FALU.D.fld(rs1_val, imm);
    } else {
        this.MMU.triggerTrap(2n, BigInt(inst), false); return;
    }

    let sizeStr = loadOp.bytes === 4 ? '32' : '64';
    let val = this.MMU.read(loadOp.addr, sizeStr);
    
    if (loadOp.bytes === 4) {
        // NaN-box the 32-bit float
        val = val | 0xFFFFFFFF00000000n;
    }
    
    this.cpu.State.f_ram[rd] = val;
    this.cpu.State.pc += 4n;
  },

  // STORE-FP (FSW, FSD)
  0x27: function(inst) {
      let rs1 = this.Decode.rs1(inst);
      let rs2 = this.Decode.rs2(inst);
      let funct3 = this.Decode.funct3(inst);
      let imm = this.Decode.imm_S(inst);
      
      let rs1_val = this.cpu.State.x_ram[rs1]; 
      let rs2_val = this.cpu.State.f_ram[rs2]; 
      
      let storeOp;
      if (funct3 === 0x2) {
          storeOp = this.cpu.FALU.F.fsw(rs1_val, rs2_val, imm);
      } else if (funct3 === 0x3) {
          storeOp = this.cpu.FALU.D.fsd(rs1_val, rs2_val, imm);
      } else {
          this.MMU.triggerTrap(2n, BigInt(inst), false); return;
      }

      let sizeStr = storeOp.bytes === 4 ? '32' : '64';
      this.MMU.write(storeOp.addr, sizeStr, storeOp.value);
      
      this.cpu.State.pc += 4n;
  },

  // FMADD (rs1 * rs2 + rs3)
  0x43: function(inst) {
      let rd = this.Decode.rd(inst);
      let rs1 = this.Decode.rs1(inst);
      let rs2 = this.Decode.rs2(inst);
      let rs3 = this.Decode.rs3(inst);
      let rm_field = this.Decode.funct3(inst); // rm is housed in funct3
      let fmt = (inst >> 25) & 0x3;            // fmt is bits 26:25
      
      let rm = this.cpu.State.get_rm(rm_field);
      let val1 = this.cpu.State.f_ram[rs1];
      let val2 = this.cpu.State.f_ram[rs2];
      let val3 = this.cpu.State.f_ram[rs3];
      
      if (fmt === 0) { // Single-Precision (.S)
          this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fmadd_s(val1, val2, val3, rm);
      } else if (fmt === 1) { // Double-Precision (.D)
          this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fmadd_d(val1, val2, val3, rm);
      } else {
          throw new Error(`Invalid FMADD fmt: ${fmt}`);
      }
      
      this.cpu.State.pc += 4n;
  },

  // FMSUB (rs1 * rs2 - rs3)
  0x47: function(inst) {
      let rd = this.Decode.rd(inst);
      let rs1 = this.Decode.rs1(inst);
      let rs2 = this.Decode.rs2(inst);
      let rs3 = this.Decode.rs3(inst);
      let rm_field = this.Decode.funct3(inst);
      let fmt = (inst >> 25) & 0x3;
      
      let rm = this.cpu.State.get_rm(rm_field);
      let val1 = this.cpu.State.f_ram[rs1];
      let val2 = this.cpu.State.f_ram[rs2];
      let val3 = this.cpu.State.f_ram[rs3];
      
      if (fmt === 0) {
          this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fmsub_s(val1, val2, val3, rm);
      } else if (fmt === 1) {
          this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fmsub_d(val1, val2, val3, rm);
      }
      this.cpu.State.pc += 4n;
  },

  // FNMSUB -(rs1 * rs2) + rs3
  0x4B: function(inst) {
      let rd = this.Decode.rd(inst);
      let rs1 = this.Decode.rs1(inst);
      let rs2 = this.Decode.rs2(inst);
      let rs3 = this.Decode.rs3(inst);
      let rm_field = this.Decode.funct3(inst);
      let fmt = (inst >> 25) & 0x3;
      
      let rm = this.cpu.State.get_rm(rm_field);
      let val1 = this.cpu.State.f_ram[rs1];
      let val2 = this.cpu.State.f_ram[rs2];
      let val3 = this.cpu.State.f_ram[rs3];
      
      if (fmt === 0) {
          this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fnmsub_s(val1, val2, val3, rm);
      } else if (fmt === 1) {
          this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fnmsub_d(val1, val2, val3, rm);
      }
      this.cpu.State.pc += 4n;
  },

  // FNMADD -(rs1 * rs2) - rs3
  0x4F: function(inst) {
      let rd = this.Decode.rd(inst);
      let rs1 = this.Decode.rs1(inst);
      let rs2 = this.Decode.rs2(inst);
      let rs3 = this.Decode.rs3(inst);
      let rm_field = this.Decode.funct3(inst);
      let fmt = (inst >> 25) & 0x3;
      
      let rm = this.cpu.State.get_rm(rm_field);
      let val1 = this.cpu.State.f_ram[rs1];
      let val2 = this.cpu.State.f_ram[rs2];
      let val3 = this.cpu.State.f_ram[rs3];
      
      if (fmt === 0) {
          this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fnmadd_s(val1, val2, val3, rm);
      } else if (fmt === 1) {
          this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fnmadd_d(val1, val2, val3, rm);
      }
      this.cpu.State.pc += 4n;
  },

  // OP-FP (FADD, FSUB, FMUL, FDIV, FSQRT, FSGNJ, FMIN, FMAX, FCVT, FMV, FEQ, FLT, FLE, FCLASS)
  0x53: function(inst) {
    let rd = this.Decode.rd(inst);
    let rs1 = this.Decode.rs1(inst);
    let rs2 = this.Decode.rs2(inst);
    let rm_field = this.Decode.funct3(inst);
    let fmt = (inst >> 25) & 0x3;       // Format: 0 = Single (.S), 1 = Double (.D)
    let funct5 = (inst >> 27) & 0x1F;   // Primary Operation selector

    let val1_f = this.cpu.State.f_ram[rs1];
    let val2_f = this.cpu.State.f_ram[rs2];
    let val1_x = this.cpu.State.x_ram[rs1];

    let write_to_x = false;
    let result_x = 0n;

    switch (funct5) {
      case 0x00: // FADD (00000)
          let rm_add = this.cpu.State.get_rm(rm_field);
          this.cpu.State.f_ram[rd] = (fmt === 0)
              ? this.cpu.FALU.F.fadd_s(val1_f, val2_f, rm_add)
              : this.cpu.FALU.D.fadd_d(val1_f, val2_f, rm_add);
          break;
      case 0x01: // FSUB (00001) - WAS 0x04
          let rm_sub = this.cpu.State.get_rm(rm_field);
          this.cpu.State.f_ram[rd] = (fmt === 0)
              ? this.cpu.FALU.F.fsub_s(val1_f, val2_f, rm_sub)
              : this.cpu.FALU.D.fsub_d(val1_f, val2_f, rm_sub);
          break;
      case 0x02: // FMUL (00010) - WAS 0x08
          let rm_mul = this.cpu.State.get_rm(rm_field);
          this.cpu.State.f_ram[rd] = (fmt === 0)
              ? this.cpu.FALU.F.fmul_s(val1_f, val2_f, rm_mul)
              : this.cpu.FALU.D.fmul_d(val1_f, val2_f, rm_mul);
          break;
      case 0x03: // FDIV (00011) - WAS 0x0C
          let rm_div = this.cpu.State.get_rm(rm_field);
          this.cpu.State.f_ram[rd] = (fmt === 0)
              ? this.cpu.FALU.F.fdiv_s(val1_f, val2_f, rm_div)
              : this.cpu.FALU.D.fdiv_d(val1_f, val2_f, rm_div);
          break;
          case 0x04: // FSGNJ, FSGNJN, FSGNJX (00100)
          if (fmt === 0) { // Single (.S)
              if (rm_field === 0) this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fsgnj_s(val1_f, val2_f);
              else if (rm_field === 1) this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fsgnjn_s(val1_f, val2_f);
              else if (rm_field === 2) this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fsgnjx_s(val1_f, val2_f);
          } else if (fmt === 1) { // Double (.D)
              if (rm_field === 0) this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fsgnj_d(val1_f, val2_f);
              else if (rm_field === 1) this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fsgnjn_d(val1_f, val2_f);
              else if (rm_field === 2) this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fsgnjx_d(val1_f, val2_f);
          }
          break;
          
      case 0x05: // FMIN, FMAX (00101)
          // Note: passing this.cpu.State so the operations can update fcsr
          if (fmt === 0) {
              if (rm_field === 0) this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fmin_s(val1_f, val2_f, this.cpu.State);
              else if (rm_field === 1) this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fmax_s(val1_f, val2_f, this.cpu.State);
          } else if (fmt === 1) {
              if (rm_field === 0) this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fmin_d(val1_f, val2_f, this.cpu.State);
              else if (rm_field === 1) this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fmax_d(val1_f, val2_f, this.cpu.State);
          }
          break;
      case 0x08: // FCVT.fmt.fmt (01000) - WAS 0x10
          let rm_cvt_ff = this.cpu.State.get_rm(rm_field);
          if (fmt === 1 && rs2 === 0) {
              this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fcvt_s_d(val1_f, rm_cvt_ff);
          } else if (fmt === 0 && rs2 === 1) {
              this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fcvt_d_s(val1_f, rm_cvt_ff);
          }
          break;
      case 0x0B: // FSQRT (01011)
          let rm_sqrt = this.cpu.State.get_rm(rm_field);
          this.cpu.State.f_ram[rd] = (fmt === 0)
              ? this.cpu.FALU.F.fsqrt_s(val1_f, rm_sqrt)
              : this.cpu.FALU.D.fsqrt_d(val1_f, rm_sqrt);
          break;
      case 0x14: // FCMP (10100)
          write_to_x = true;
          if (fmt === 0) {
              if (rm_field === 0) result_x = this.cpu.FALU.F.fle_s(val1_f, val2_f);
              else if (rm_field === 1) result_x = this.cpu.FALU.F.flt_s(val1_f, val2_f);
              else if (rm_field === 2) result_x = this.cpu.FALU.F.feq_s(val1_f, val2_f);
          } else if (fmt === 1) {
              if (rm_field === 0) result_x = this.cpu.FALU.D.fle_d(val1_f, val2_f);
              else if (rm_field === 1) result_x = this.cpu.FALU.D.flt_d(val1_f, val2_f);
              else if (rm_field === 2) result_x = this.cpu.FALU.D.feq_d(val1_f, val2_f);
          }
          break;
        case 0x18: // Was 0x60: FCVT.int.fmt (Float to Integer)
            write_to_x = true;
            let rm_cvt_i = this.cpu.State.get_rm(rm_field);
            if (fmt === 0) {
                if (rs2 === 0) result_x = this.cpu.FALU.F.fcvt_w_s(val1_f, rm_cvt_i);
                else if (rs2 === 1) result_x = this.cpu.FALU.F.fcvt_wu_s(val1_f, rm_cvt_i);
                else if (rs2 === 2) result_x = this.cpu.FALU.F.fcvt_l_s(val1_f, rm_cvt_i);
                else if (rs2 === 3) result_x = this.cpu.FALU.F.fcvt_lu_s(val1_f, rm_cvt_i);
            } else if (fmt === 1) {
                if (rs2 === 0) result_x = this.cpu.FALU.D.fcvt_w_d(val1_f, rm_cvt_i);
                else if (rs2 === 1) result_x = this.cpu.FALU.D.fcvt_wu_d(val1_f, rm_cvt_i);
                else if (rs2 === 2) result_x = this.cpu.FALU.D.fcvt_l_d(val1_f, rm_cvt_i);
                else if (rs2 === 3) result_x = this.cpu.FALU.D.fcvt_lu_d(val1_f, rm_cvt_i);
            }
            break;
        case 0x1A: // Was 0x68: FCVT.fmt.int (Integer to Float)
            let rm_cvt_f = this.cpu.State.get_rm(rm_field);
            if (fmt === 0) {
                if (rs2 === 0) this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fcvt_s_w(val1_x, rm_cvt_f);
                else if (rs2 === 1) this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fcvt_s_wu(val1_x, rm_cvt_f);
                else if (rs2 === 2) this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fcvt_s_l(val1_x, rm_cvt_f);
                else if (rs2 === 3) this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fcvt_s_lu(val1_x, rm_cvt_f);
            } else if (fmt === 1) {
                if (rs2 === 0) this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fcvt_d_w(val1_x, rm_cvt_f);
                else if (rs2 === 1) this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fcvt_d_wu(val1_x, rm_cvt_f);
                else if (rs2 === 2) this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fcvt_d_l(val1_x, rm_cvt_f);
                else if (rs2 === 3) this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fcvt_d_lu(val1_x, rm_cvt_f);
            }
            break;
        case 0x1C: // Was 0x70: FMV.X.D or FCLASS.D
            write_to_x = true;
            if (fmt === 0) {
                if (rm_field === 0) result_x = this.cpu.FALU.F.fmv_x_w(val1_f);
                else if (rm_field === 1) result_x = this.cpu.FALU.F.fclass_s(val1_f);
            } else if (fmt === 1) {
                if (rm_field === 0) result_x = this.cpu.FALU.D.fmv_x_d(val1_f);
                else if (rm_field === 1) result_x = this.cpu.FALU.D.fclass_d(val1_f);
            }
            break;
        case 0x1E: // Was 0x78: FMV.D.X
            if (fmt === 0) {
                this.cpu.State.f_ram[rd] = this.cpu.FALU.F.fmv_w_x(val1_x);
            } else if (fmt === 1) {
                this.cpu.State.f_ram[rd] = this.cpu.FALU.D.fmv_d_x(val1_x);
            }
            break;

        default:
            throw new Error(`Unimplemented OP-FP funct5: 0x${funct5.toString(16)}`);
    }

    // Write-back for instructions that target the Integer Register File
    if (write_to_x && rd !== 0) {
        this.cpu.State.x_ram[rd] = result_x;
    }

    this.cpu.State.pc += 4n;
  }
}

RVALUATION64.Opcodes.SYSTEM$MEMORY = {
  // ----------------------------------------
  // MISC-MEM (FENCE, FENCE.I) - Opcode 0x0F
  // ----------------------------------------
  0x0F: function(inst) {
    let funct3 = this.Decode.funct3(inst);
    if (funct3 === 0x0) {
      if (this.cpu.System.Base.fence) this.cpu.System.Base.fence();
    } else if (funct3 === 0x1) {
      if (this.cpu.System.Zifencei.fence_i) this.cpu.System.Zifencei.fence_i();
    }
    this.cpu.State.pc += 4n;
  },

  // ----------------------------------------
  // SYSTEM (ECALL, EBREAK, SRET, MRET, CSRs) - Opcode 0x73
  // ----------------------------------------
  0x73: function(inst) {
    const rd = this.Decode.rd(inst);
    const rs1 = this.Decode.rs1(inst);
    const rs2 = this.Decode.rs2(inst);
    const funct3 = this.Decode.funct3(inst);
    const funct7 = (inst >>> 25) & 0x7F;
    const imm12 = (inst >>> 20) & 0xFFF;

    // --- PRIVILEGED & SPECIAL INSTRUCTIONS (funct3 == 0) ---
    if (funct3 === 0) {
      switch (imm12) {
        case 0x000: { // ECALL
          let cause = 8n; // User mode
          if (this.cpu.State.prv === 1n) cause = 9n;  // Supervisor
          if (this.cpu.State.prv === 3n) cause = 11n; // Machine
          
          // SPEC FIX: tval must be 0n for ECALL
          this.MMU.triggerTrap(cause, 0n, false);
          return; 
        }

        case 0x001: // EBREAK
          this.MMU.triggerTrap(3n, this.cpu.State.pc, false);
          return;

        case 0x102: { // SRET (Supervisor Return)
          if (this.cpu.State.prv < 1n) {
            this.MMU.triggerTrap(2n, BigInt(inst), false);
            return;
          }
          let mstatus = this.cpu.State.csr.get(0x300) || 0n;
          if (this.cpu.State.prv === 1n && (mstatus & (1n << 22n))) {
            this.MMU.triggerTrap(2n, BigInt(inst), false);
            return;
          }
          
          let spp = (mstatus >> 8n) & 1n;   
          let spie = (mstatus >> 5n) & 1n;  
          
          mstatus &= ~(1n << 1n);       
          mstatus |= (spie << 1n);      
          mstatus |= (1n << 5n);        
          mstatus &= ~(1n << 8n);       
          
          this.cpu.State.csr.set(0x300, mstatus);
          this.cpu.State.prv = spp;
          this.cpu.State.pc = this.cpu.State.csr.get(0x141); 
          return;
        }

        case 0x302: { // MRET (Machine Return)
          if (this.cpu.State.prv < 3n) {
            this.MMU.triggerTrap(2n, BigInt(inst), false);
            return;
          }
          let mstatus = this.cpu.State.csr.get(0x300) || 0n;
          let mpp = (mstatus >> 11n) & 3n;  
          let mpie = (mstatus >> 7n) & 1n;  
          
          mstatus &= ~(1n << 3n);        
          mstatus |= (mpie << 3n);       
          mstatus |= (1n << 7n);         
          mstatus &= ~(3n << 11n);       
          
          if (mpp !== 3n) mstatus &= ~(1n << 17n);

          this.cpu.State.csr.set(0x300, mstatus);
          this.cpu.State.prv = mpp;
          this.cpu.State.pc = this.cpu.State.csr.get(0x341); 
          return;
        }

        case 0x105: { // WFI (Wait For Interrupt)
          let mstatus = this.cpu.State.csr.get(0x300) || 0n;
          // SPEC FIX: WFI timeout wait applies to both S-mode and U-mode (prv < 3)
          if (this.cpu.State.prv < 3n && (mstatus & (1n << 21n))) {
              this.MMU.triggerTrap(2n, BigInt(inst), false);
              return;
          }
          this.MMU.checkInterrupts();
          break;
        }

        default:
          if (funct7 === 0x09) { // SFENCE.VMA
            if (rd !== 0 || this.cpu.State.prv < 1n) {
                this.MMU.triggerTrap(2n, BigInt(inst), false);
                return;
            }
            const vaddr = (rs1 === 0) ? 0n : this.cpu.State.x_ram[rs1];
            const asid = (rs2 === 0) ? 0n : (this.cpu.State.x_ram[rs2] & 0xFFFFn);
            this.MMU.flushTLB(vaddr, asid);
            break;
          }
          this.MMU.triggerTrap(2n, BigInt(inst), false); 
          return;
      }
    } 
    
    // --- Zicsr (CSR Instructions) (funct3 != 0) ---
    else {
      const csr_addr = imm12;
      const zimm = BigInt(rs1); 
      let rs1_val = (funct3 & 0x4) ? zimm : this.cpu.State.x_ram[rs1];
      
      // SPEC FIX: Correct CSR Bit Masking
      // Bits 9:8 denote the lowest privilege required
      const priv_required = (csr_addr >> 8) & 0x3;
      if (this.cpu.State.prv < BigInt(priv_required)) {
        this.MMU.triggerTrap(2n, BigInt(inst), false);
        return;
      }

      // SPEC FIX: Correct Read-Only Masking
      // Bits 11:10 == 3 (binary 11) means read-only
      const is_read_only = (csr_addr >> 10) === 0x3;
      
      // Write Attempt detection is flawless (funct3 bit 0 handles RW/RWI, others check rs1/zimm)
      const is_write_attempt = (funct3 & 0x3) === 0x1 || (funct3 & 0x4 ? zimm !== 0n : rs1 !== 0);

      if (is_read_only && is_write_attempt) {
        this.MMU.triggerTrap(2n, BigInt(inst), false);
        return;
      }

      let old_val = 0n;

      try {
        switch (funct3) {
          case 0x1: // CSRRW
            if (rd !== 0) old_val = this.cpu.System.Zicsr.read(csr_addr);
            this.cpu.System.Zicsr.write(csr_addr, rs1_val);
            break;
          case 0x2: // CSRRS
            old_val = this.cpu.System.Zicsr.read(csr_addr);
            if (rs1 !== 0) this.cpu.System.Zicsr.write(csr_addr, old_val | rs1_val);
            break;
          case 0x3: // CSRRC
            old_val = this.cpu.System.Zicsr.read(csr_addr);
            if (rs1 !== 0) this.cpu.System.Zicsr.write(csr_addr, old_val & ~rs1_val);
            break;
          case 0x5: // CSRRWI
            if (rd !== 0) old_val = this.cpu.System.Zicsr.read(csr_addr);
            this.cpu.System.Zicsr.write(csr_addr, zimm);
            break;
          case 0x6: // CSRRSI
            old_val = this.cpu.System.Zicsr.read(csr_addr);
            if (zimm !== 0n) this.cpu.System.Zicsr.write(csr_addr, old_val | zimm);
            break;
          case 0x7: // CSRRCI
            old_val = this.cpu.System.Zicsr.read(csr_addr);
            if (zimm !== 0n) this.cpu.System.Zicsr.write(csr_addr, old_val & ~zimm);
            break;
          default:
            this.MMU.triggerTrap(2n, BigInt(inst), false);
            return;
        }
        
        if (rd !== 0) this.cpu.State.x_ram[rd] = old_val;
        
      } catch (e) {
        this.MMU.triggerTrap(2n, BigInt(inst), false);
        return;
      }
    }

    this.cpu.State.pc += 4n;
  }
};

RVALUATION64.MMU = {
      UART_BASE:   0x10000000n, UART_SIZE:   0x100n,
      CLINT_BASE:  0x02000000n, CLINT_SIZE:  0x10000n,
      VIRTIO_BASE: 0x10001000n, VIRTIO_SIZE: 0x1000n,

      // --- TRAP ROUTING ---
      triggerTrap: function(cause, vaddr, isInterrupt = false) {
        let state = RVALUATION64.cpu.State;
        let prv = state.prv;
        
        const medeleg = state.csr.get(0x302) || 0n; 
        const mideleg = state.csr.get(0x303) || 0n; 
        
        let deleg = isInterrupt ? mideleg : medeleg;
        let trapToS = (prv <= 1n) && ((deleg & (1n << (cause & 0x3Fn))) !== 0n);
    
        let mstatus = state.csr.get(0x300) || 0n;
    
        if (trapToS) {
            // --- Supervisor Trap Path ---
            let sie = (mstatus >> 1n) & 1n;
            mstatus &= ~(1n << 5n); // Clear SPIE
            mstatus |= (sie << 5n);  // SPIE = SIE
            mstatus &= ~(1n << 1n); // SIE = 0
            mstatus &= ~(1n << 8n); // Clear SPP
            mstatus |= (prv << 8n);  // SPP = previous privilege
            
            state.csr.set(0x141, state.pc);         // sepc
            state.csr.set(0x142, isInterrupt ? (0x8000000000000000n | cause) : cause); // scause
            state.csr.set(0x143, vaddr);           // stval
            state.prv = 1n;
        } else {
            // --- Machine Trap Path ---
            let mie = (mstatus >> 3n) & 1n;
            mstatus &= ~(1n << 7n); // Clear MPIE
            mstatus |= (mie << 7n);  // MPIE = MIE
            mstatus &= ~(1n << 3n); // MIE = 0
            mstatus &= ~(3n << 11n); // Clear MPP
            mstatus |= (prv << 11n); // MPP = previous privilege
            
            state.csr.set(0x341, state.pc);         // mepc
            state.csr.set(0x342, isInterrupt ? (0x8000000000000000n | cause) : cause); // mcause
            state.csr.set(0x343, vaddr);           // mtval
            state.prv = 3n;
        }
    
        // --- SHARED COMPLIANT PC CALCULATION ---
        // This now works for both S-mode and M-mode traps
        let tvec = state.csr.get(trapToS ? 0x105 : 0x305) || 0n;
        let tvecBase = tvec & ~3n;
        let tvecMode = tvec & 3n;
    
        if (isInterrupt && tvecMode === 1n) {
            // Vectored mode: jump to base + 4 * cause
            state.pc = tvecBase + ((cause & 0x3Fn) * 4n);
        } else {
            // Direct mode: jump to base
            state.pc = tvecBase;
        }
    
        state.csr.set(0x300, mstatus);
        throw new Error("TRAP_RAISED");
      },

      // --- SFENCE.VMA: TLB FLUSHING ---
      flushTLB: function(vaddr, asid) {
        // If vaddr is 0, flush all. If asid is 0, flush all ASIDs for that vaddr.
        if (vaddr === 0n && asid === 0n) {
            RVALUATION64.cpu.State.tlb.clear();
        } else {
            for (let key of RVALUATION64.cpu.State.tlb.keys()) {
                let [k_vpn, k_asid] = key.split('_').map(BigInt);
                if ((vaddr === 0n || k_vpn === (vaddr >> 12n)) && 
                    (asid === 0n || k_asid === asid)) {
                    RVALUATION64.cpu.State.tlb.delete(key);
                }
            }
        }
      },

      translate: function(vaddr, accessType) {
        let state = RVALUATION64.cpu.State;
        let effectivePrv = state.prv;
        const mstatus = state.csr.get(0x300) || 0n;
        
        if ((mstatus & (1n << 17n)) !== 0n && accessType !== 0) {
            effectivePrv = (mstatus >> 11n) & 3n;
        }
        
        if (effectivePrv === 3n) return vaddr;
        const satp = state.csr.get(0x180) || 0n;
        if (((satp >> 60n) & 0xFn) === 0n) return vaddr;

        // Canonical check
        const bit38 = (vaddr >> 38n) & 1n;
        const upperBits = (vaddr >> 39n) & 0x1FFFFFFn;
        if ((bit38 === 0n && upperBits !== 0n) || (bit38 === 1n && upperBits !== 0x1FFFFFFn)) {
            this.triggerTrap(accessType === 0 ? 12n : (accessType === 1 ? 13n : 15n), vaddr);
        }

        let ppn = satp & 0xFFFFFFFFFFFn;
        const vpn = [(vaddr >> 12n) & 0x1FFn, (vaddr >> 21n) & 0x1FFn, (vaddr >> 30n) & 0x1FFn];

        let i = 2;
        let pte, pteAddr;
        while (i >= 0) {
            pteAddr = (ppn << 12n) + (vpn[i] << 3n);
            pte = RVALUATION64.memory.read64(pteAddr);
            
            // 1. Check validity and reserved bits (63-54)
            if (!(pte & 1n) || (pte >> 54n) !== 0n || (!(pte & 2n) && (pte & 4n))) {
                this.triggerTrap(accessType === 0 ? 12n : (accessType === 1 ? 13n : 15n), vaddr);
            }
            
            if (pte & 14n) break; // Leaf found (R, W, or X set)
            i--;
            if (i < 0) this.triggerTrap(accessType === 0 ? 12n : (accessType === 1 ? 13n : 15n), vaddr);
            ppn = (pte >> 10n) & 0xFFFFFFFFFFFn;
        }

        // 2. Permission Checks
        const u = (pte >> 4n) & 1n;
        if (effectivePrv === 0n && !u) this.triggerTrap(accessType === 0 ? 12n : (accessType === 1 ? 13n : 15n), vaddr);
        if (effectivePrv === 1n && u && !(mstatus & (1n << 18n))) this.triggerTrap(accessType === 0 ? 12n : (accessType === 1 ? 13n : 15n), vaddr);

        if (accessType === 0 && !(pte & 8n)) this.triggerTrap(12n, vaddr);
        if (accessType === 1 && !(pte & 2n) && !((mstatus & (1n << 19n)) && (pte & 8n))) this.triggerTrap(13n, vaddr);
        if (accessType === 2 && !(pte & 4n)) this.triggerTrap(15n, vaddr);

        // 3. Alignment Checks
        if (i > 0 && ((pte >> 10n) & ((1n << (9n * BigInt(i))) - 1n)) !== 0n) {
            this.triggerTrap(accessType === 0 ? 12n : (accessType === 1 ? 13n : 15n), vaddr);
        }

        // 4. COMPLIANT A/D BIT MANAGEMENT (Hardware Update)
        let newPte = pte | (1n << 6n); // Always set Accessed
        if (accessType === 2) newPte |= (1n << 7n); // Set Dirty on write
        if (newPte !== pte) RVALUATION64.memory.write64(pteAddr, newPte);

        const pageOffset = vaddr & 0xFFFn;
        if (i === 0) return ((pte >> 10n) << 12n) | pageOffset;
        if (i === 1) return ((pte >> 19n) << 21n) | (vpn[0] << 12n) | pageOffset;
        return ((pte >> 28n) << 30n) | (vpn[1] << 21n) | (vpn[0] << 12n) | pageOffset;
      },

      get_paddr: function(vaddr, accessType) {
        let state = RVALUATION64.cpu.State;
        const satp = state.csr.get(0x180) || 0n;
        const mode = (satp >> 60n) & 0xFn;
        if (mode === 0n || state.prv === 3n) return vaddr;

        const asid = (satp >> 44n) & 0xFFFFn;
        const vpn = vaddr >> 12n;
        const tlbKey = `${vpn}_${asid}_${state.prv}_${accessType}`;
        
        let cached = state.tlb.get(tlbKey);
        if (cached !== undefined) return cached | (vaddr & 0xFFFn);

        const paddr = this.translate(vaddr, accessType);
        state.tlb.set(tlbKey, paddr & ~0xFFFn);
        return paddr;
      },
      // --- CORE OPERATIONS ---
      fetch: function(vaddr) { 
          const paddr1 = this.get_paddr(vaddr, 0);
          const lower16 = RVALUATION64.memory.readU16(paddr1);
          
          if ((lower16 & 0x3) !== 0x3) return lower16; 
          
          const paddr2 = this.get_paddr(vaddr + 2n, 0);
          const upper16 = RVALUATION64.memory.readU16(paddr2);
          return lower16 | (upper16 << 16);
      },

      read: function(vaddr, sizeStr) {
          const paddr = this.get_paddr(vaddr, 1);
          
          if (paddr >= this.UART_BASE && paddr < this.UART_BASE + this.UART_SIZE) {
              return BigInt(RVALUATION64.cpu.UART.read(Number(paddr - this.UART_BASE)));
          }
          if (paddr >= this.CLINT_BASE && paddr < this.CLINT_BASE + this.CLINT_SIZE) {
              return RVALUATION64.cpu.CLINT.read(paddr - this.CLINT_BASE);
          }
          if (paddr >= this.VIRTIO_BASE && paddr < this.VIRTIO_BASE + this.VIRTIO_SIZE) {
              return BigInt(RVALUATION64.cpu.VIRTIO.read(Number(paddr - this.VIRTIO_BASE)));
          }
          
          return RVALUATION64.memory['read' + sizeStr](paddr);
      },

      write: function(vaddr, sizeStr, val) {
          const paddr = this.get_paddr(vaddr, 2);
          
          if (paddr >= this.UART_BASE && paddr < this.UART_BASE + this.UART_SIZE) {
              RVALUATION64.cpu.UART.write(Number(paddr - this.UART_BASE), val);
              return; 
          }
          if (paddr >= this.CLINT_BASE && paddr < this.CLINT_BASE + this.CLINT_SIZE) {
              RVALUATION64.cpu.CLINT.write(paddr - this.CLINT_BASE, val);
              return;
          }
          if (paddr >= this.VIRTIO_BASE && paddr < this.VIRTIO_BASE + this.VIRTIO_SIZE) {
              RVALUATION64.cpu.VIRTIO.write(Number(paddr - this.VIRTIO_BASE), val);
              return;
          }
          
          RVALUATION64.memory['write' + sizeStr](paddr, val);
      },

      checkInterrupts: function() {
          let state = RVALUATION64.cpu.State;
          const mip = state.csr.get(0x344) || 0n; 
          const mie = state.csr.get(0x304) || 0n; 
          const mstatus = state.csr.get(0x300) || 0n;
        
          const pending = mip & mie;
          if (pending === 0n) return false;
        
          const mideleg = state.csr.get(0x303) || 0n; 
        
          const m_enabled = (state.prv < 3n) || ((mstatus & (1n << 3n)) !== 0n);
          const s_enabled = (state.prv < 1n) || ((state.prv === 1n) && ((mstatus & (1n << 1n)) !== 0n));
        
          const interrupt_sources = [11n, 3n, 7n, 9n, 1n, 5n]; 
        
          for (const cause of interrupt_sources) {
              if ((pending & (1n << cause)) !== 0n) {
                  const isDelegatedToS = (mideleg & (1n << cause)) !== 0n;
        
                  if ((isDelegatedToS && s_enabled) || (!isDelegatedToS && m_enabled)) {
                      this.triggerTrap(cause, 0n, true);
                      return true; 
                  }
              }
          }
          return false;
      },
    } 
// ==========================================
// EXECUTION ENGINE
// ==========================================
RVALUATION64.step = function() {
  try {
      if (this.MMU.checkInterrupts()) return;

      let pc = this.cpu.State.pc;
      let inst = this.MMU.fetch(pc); 
      
      if ((inst & 0x3) !== 0x3) {
          this.handleCompressed(inst & 0xFFFF);
          return;
      }

      let opcode = this.Decode.opcode(inst);
      let handler = null;
      
      // Flattened lookup based on opcode matching to standard RISC-V definitions
      if (opcode === 0x37 || opcode === 0x17 || opcode === 0x6F || opcode === 0x67 || opcode === 0x63 || opcode === 0x03 || opcode === 0x23 || opcode === 0x13 || opcode === 0x33) handler = this.Opcodes.BASE_INTEGER;
      else if (opcode === 0x1B || opcode === 0x3B) handler = this.Opcodes.RV64I_SPECIFIC;
      else if (opcode === 0x2F) handler = this.Opcodes.ATOMICS;
      else if (opcode === 0x07 || opcode === 0x27 || opcode === 0x43 || opcode === 0x47 || opcode === 0x4B || opcode === 0x4F || opcode === 0x53) handler = this.Opcodes.FLOATING_POINT;
      else if (opcode === 0x0F || opcode === 0x73) handler = this.Opcodes.SYSTEM$MEMORY;

      if (handler && handler[opcode]) {
          handler[opcode].call(this, inst); 
      } else {
          this.MMU.triggerTrap(2n, BigInt(inst), false); // Illegal Instruction Trap
      }
    } catch (e) {
      if (e.message !== "TRAP_RAISED") {
          console.error(`💥 CRASH AT PC: 0x${this.cpu.State.pc.toString(16)}`);
          console.error(`Error Message: ${e.message}`);
          console.error("Stack Trace:\n", e.stack);
          throw e; 
      }
  }
}

RVALUATION64.handleCompressed = function(inst16) {
  // 1. Expand the 16-bit instruction into a 32-bit equivalent
  let inst32 = this.expandCompressed(inst16);

  if (inst32 === null) {
      // Unmapped or illegal compressed instruction (e.g., all zeros)
      this.MMU.triggerTrap(2n, BigInt(inst16), false);
      return;
  }

  // 2. Decode the expanded 32-bit instruction
  let opcode = this.Decode.opcode(inst32);
  let handler = null;
  
  if (opcode === 0x37 || opcode === 0x17 || opcode === 0x6F || opcode === 0x67 || opcode === 0x63 || opcode === 0x03 || opcode === 0x23 || opcode === 0x13 || opcode === 0x33) handler = this.Opcodes.BASE_INTEGER;
  else if (opcode === 0x1B || opcode === 0x3B) handler = this.Opcodes.RV64I_SPECIFIC;
  else if (opcode === 0x2F) handler = this.Opcodes.ATOMICS;
  else if (opcode === 0x07 || opcode === 0x27 || opcode === 0x43 || opcode === 0x47 || opcode === 0x4B || opcode === 0x4F || opcode === 0x53) handler = this.Opcodes.FLOATING_POINT;
  else if (opcode === 0x0F || opcode === 0x73) handler = this.Opcodes.SYSTEM$MEMORY;
    // Save the current PC before execution
    let old_pc = this.cpu.State.pc;
  if (handler && handler[opcode]) {
      // Execute the expanded 32-bit instruction
      handler[opcode].call(this, inst32);
  } else {
      this.MMU.triggerTrap(2n, BigInt(inst16), false); 
  }// Correct the PC increment to +2 if the standard handler blindly did +4
  if (this.cpu.State.pc === old_pc + 4n) {
    this.cpu.State.pc = old_pc + 2n;
  }
}

RVALUATION64.expandCompressed = function(inst16) {
      if (inst16 === 0x0000) return null; // All zeros is explicitly an illegal instruction

      let op = inst16 & 0x3;                // Quadrant (Lowest 2 bits)
      let funct3 = (inst16 >> 13) & 0x7;    // Funct3 (Top 3 bits)
      let c = this.cpu.C;                   // Alias for your maps

      switch (op) {
          // ----------------------------------------
          // QUADRANT 00 (0x0)
          // ----------------------------------------
          case 0:
              switch (funct3) {
                  case 0: return c.MathLogic.c_addi4spn(inst16);
                  case 1: return c.LoadsStores.c_fld(inst16);
                  case 2: return c.LoadsStores.c_lw(inst16);
                  case 3: return c.LoadsStores.c_ld(inst16); 
                  case 5: return c.LoadsStores.c_fsd(inst16);
                  case 6: return c.LoadsStores.c_sw(inst16);
                  case 7: return c.LoadsStores.c_sd(inst16);
                  default: return null;
              }

          // ----------------------------------------
          // QUADRANT 01 (0x1)
          // ----------------------------------------
          case 1:
              switch (funct3) {
                  case 0: 
                      if (((inst16 >> 2) & 0x7FF) === 0) return c.Misc.c_nop(inst16);
                      return c.MathLogic.c_addi(inst16);
                  case 1: return c.MathLogic.c_addiw(inst16);
                  case 2: return c.MathLogic.c_li(inst16);
                  case 3: 
                      let rd = (inst16 >> 7) & 0x1F;
                      if (rd === 2) return c.MathLogic.c_addi16sp(inst16); // sp (x2)
                      if (rd !== 0) return c.MathLogic.c_lui(inst16);
                      return null;
                  case 4:
                      // Math/Logic cluster (Funct2 handles the split)
                      let funct2 = (inst16 >> 10) & 0x3;
                      let funct6 = (inst16 >> 12) & 0x1;
                      if (funct2 === 0) return c.MathLogic.c_srli(inst16);
                      if (funct2 === 1) return c.MathLogic.c_srai(inst16);
                      if (funct2 === 2) return c.MathLogic.c_andi(inst16);
                      if (funct2 === 3) {
                          let funct1 = (inst16 >> 5) & 0x1;
                          let funct2_lower = (inst16 >> 5) & 0x3;
                          if (funct6 === 0) {
                              if (funct2_lower === 0) return c.MathLogic.c_sub(inst16);
                              if (funct2_lower === 1) return c.MathLogic.c_xor(inst16);
                              if (funct2_lower === 2) return c.MathLogic.c_or(inst16);
                              if (funct2_lower === 3) return c.MathLogic.c_and(inst16);
                          } else { // funct6 === 1
                              if (funct2_lower === 0) return c.MathLogic.c_subw(inst16);
                              if (funct2_lower === 1) return c.MathLogic.c_addw(inst16);
                          }
                      }
                      return null;
                  case 5: return c.Control.c_j(inst16);
                  case 6: return c.Control.c_beqz(inst16);
                  case 7: return c.Control.c_bnez(inst16);
                  default: return null;
              }

          // ----------------------------------------
          // QUADRANT 02 (0x2)
          // ----------------------------------------
          case 2:
              switch (funct3) {
                  case 0: return c.MathLogic.c_slli(inst16);
                  case 1: return c.LoadsStores.c_fldsp(inst16);
                  case 2: return c.LoadsStores.c_lwsp(inst16);
                  case 3: return c.LoadsStores.c_ldsp(inst16);
                  case 4:
                      let rs1 = (inst16 >> 7) & 0x1F;
                      let rs2 = (inst16 >> 2) & 0x1F;
                      let bit12 = (inst16 >> 12) & 0x1;
                      if (bit12 === 0) {
                          if (rs2 === 0) return c.Control.c_jr(inst16);
                          else return c.Misc.c_mv(inst16);
                      } else {
                          if (rs2 === 0 && rs1 === 0) return c.Misc.c_ebreak(inst16);
                          if (rs2 === 0 && rs1 !== 0) return c.Control.c_jalr(inst16);
                          if (rs2 !== 0 && rs1 !== 0) return c.MathLogic.c_add(inst16);
                      }
                      return null;
                  case 5: return c.LoadsStores.c_fsdsp(inst16);
                  case 6: return c.LoadsStores.c_swsp(inst16);
                  case 7: return c.LoadsStores.c_sdsp(inst16);
                  default: return null;
              }

          default: return null;
      }
}

RVALUATION64.cpu.UART = new UART16550();
class PhysicalMemory {
  constructor(sizeInBytes, baseAddress = 0x80000000n) {
      this.buffer = new ArrayBuffer(sizeInBytes);
      this.view = new DataView(this.buffer);
      this.base = baseAddress;
      this.size = BigInt(sizeInBytes);
  }

  _offset(addr) {
      addr = BigInt(addr);
      if (addr < this.base || addr >= this.base + this.size) {
          // Throw a fatal error to immediately halt the CPU loop
          throw new Error(`BUS_FAULT: 0x${addr.toString(16)}`);
      }
      return Number(addr - this.base);
  }

  // ==========================================
  // CPU / MMU INTERFACE
  // RISC-V is Little-Endian (true flag in DataView).
  // These MUST return BigInts for the LSU to process safely.
  // ==========================================
  read8(addr)  { return BigInt(this.view.getUint8(this._offset(addr))); }
  read16(addr) { return BigInt(this.view.getUint16(this._offset(addr), true)); }
  read32(addr) { return BigInt(this.view.getUint32(this._offset(addr), true)); }
  read64(addr) { return this.view.getBigUint64(this._offset(addr), true); }

  write8(addr, val) { 
    // Convert addr to BigInt once for the check
    const bAddr = BigInt(addr);

    // 1. Intercept the UART TX Address (0x10000000)
    if (bAddr === 0x10000000n) { 
        // Use the 'val' argument (and ensure it's a Number for fromCharCode)
        const char = String.fromCharCode(Number(val) & 0xFF);
        terminalBuffer += char;

        // 2. Look for our ANSI "Clear Screen" escape sequence
        // \x1b is the Escape character (27)
        if (terminalBuffer.endsWith('\x1b[2J\x1b[H')) {
            terminalEl.textContent = ""; 
            terminalBuffer = "";         
        } 
        // 3. Flush to the screen on every newline
        else if (char === '\n') {
            terminalEl.textContent += terminalBuffer;
            terminalBuffer = "";
        }
        return; 
    }

    // Normal RAM write
    this.view.setUint8(this._offset(addr), Number(BigInt(val) & 0xFFn)); 
  }
  write16(addr, val) { this.view.setUint16(this._offset(addr), Number(BigInt(val) & 0xFFFFn), true); }
  write32(addr, val) { this.view.setUint32(this._offset(addr), Number(BigInt(val) & 0xFFFFFFFFn), true); }
  write64(addr, val) { this.view.setBigUint64(this._offset(addr), BigInt(val), true); }

  // ==========================================
  // VIRTIO HELPERS
  // Your VirtIO block uses strict equality (===) against standard JS Numbers (e.g., `if (type === 0)`). 
  // To prevent 0n === 0 evaluating to false, these specifically return standard Numbers.
  // ==========================================
  readU8(addr)  { return this.view.getUint8(this._offset(addr)); }
  readU16(addr) { return this.view.getUint16(this._offset(addr), true); }
  readU32(addr) { return this.view.getUint32(this._offset(addr), true); }
  readU64(addr) { return this.view.getBigUint64(this._offset(addr), true); } // 64-bit stays BigInt
}
// 1. Initialize RAM and CPU
const RAM_SIZE = 128 * 1024 * 1024;
RVALUATION64.memory = new PhysicalMemory(RAM_SIZE, 0x80000000n);
const machineCode = new Uint32Array([
  0x00002197, 0x80018193, 0x00100117, 0xff810113,
  0x0040006f, 0xed010113, 0x00000797, 0x4907b787,
  0x5a07f7d3, 0x00000797, 0x4747b587, 0x02b7f7d3,
  0x00000797, 0x4807b687, 0xf2000253, 0x00000797,
  0x47c7b707, 0x00013823, 0x00b13c27, 0x02013423,
  0x12d7f7d3, 0x02e13827, 0x04013023, 0x04b13427,
  0x04013c23, 0x06e13027, 0x06b13827, 0x22f796d3,
  0x08013023, 0x02f13027, 0x02f13c27, 0x04d13827,
  0x06d13427, 0x06f13c27, 0x08e13427, 0x08f13827,
  0x08013c23, 0x0ab13027, 0x0ad13427, 0x0a013823,
  0x0ae13c27, 0x0cd13027, 0x0c013423, 0x0cf13827,
  0x0c013c23, 0x0eb13027, 0x0ed13427, 0x0e013823,
  0x0000c337, 0x0eb13c27, 0x03200f13, 0x10f13027,
  0x10413427, 0x10e13827, 0x10d13c27, 0x12413027,
  0x12e13427, 0xb4818513, 0x00000797, 0x3a87be07,
  0x00000797, 0x3b07b087, 0x00000797, 0x3c87b187,
  0x00000797, 0x3c87b107, 0x00000797, 0x3e87b887,
  0x10000637, 0x02000593, 0x13010893, 0x02700813,
  0x00000797, 0x3b07b807, 0x00000797, 0x3b07b387,
  0x00000797, 0x3b07b307, 0x00000797, 0x3b07b287,
  0x01300e93, 0x00001e17, 0xebce0e13, 0x04000f93,
  0x34f30313, 0x01b00713, 0x00000797, 0x2f878793,
  0x00178793, 0x00e60023, 0x0007c703, 0xfe071ae3,
  0x82818693, 0x00068713, 0xfd870793, 0x00b78023,
  0x00178793, 0xfef71ce3, 0x02870713, 0xfee516e3,
  0x00000717, 0x2c870713, 0x02d00793, 0x00170713,
  0x00f60023, 0x00074783, 0xfe079ae3, 0x124277d3,
  0x22420653, 0x224206d3, 0x23ce0753, 0x00800793,
  0x22f79053, 0x0ab777d3, 0xfff7879b, 0x12e7f7d3,
  0x02177753, 0x1af077d3, 0x12f6f6d3, 0x02d67653,
  0xfe0792e3, 0x22b586d3, 0x22b58553, 0x22108753,
  0x00800793, 0x0ab777d3, 0xfff7879b, 0x12e7f7d3,
  0x02177753, 0x1af077d3, 0x12f57553, 0x02a6f6d3,
  0xfe0792e3, 0x01010793, 0x0107b707, 0x0007b787,
  0x12c77553, 0x22f79053, 0x52d7f7c3, 0x1237f7c3,
  0xc2079753, 0x0007071b, 0x04e86063, 0x12c077d3,
  0x0087b507, 0x13057553, 0x7ad777c3, 0x5277f7cb,
  0x2a67f7c3, 0xc20793d3, 0x0003839b, 0x00239293,
  0x007282b3, 0x00329293, 0x005e02b3, 0x00e28733,
  0x007ee463, 0x01f70023, 0x01878793, 0xf9179ee3,
  0x00a00293, 0xfd868793, 0x0007c703, 0x00178793,
  0x00e60023, 0xfef69ae3, 0x00560023, 0x02868693,
  0xfed512e3, 0x00012623, 0x00c12783, 0x0007879b,
  0x00f34e63, 0x00c12783, 0x0017879b, 0x00f12623,
  0x00c12783, 0x0007879b, 0xfef356e3, 0xffff0f1b,
  0x03127253, 0xe80f10e3, 0x04100713, 0x00000797,
  0x19c78793, 0x100006b7, 0x00178793, 0x00e68023,
  0x0007c703, 0xfe071ae3, 0x00100073, 0x00000513,
  0x13010113, 0x00008067, 0x100007b7, 0x00a78023,
  0x00008067, 0x00054783, 0x00078c63, 0x10000737,
  0x00150513, 0x00f70023, 0x00054783, 0xfe079ae3,
  0x00008067, 0x01b00713, 0x00000797, 0x11878793,
  0x100006b7, 0x00178793, 0x00e68023, 0x0007c703,
  0xfe071ae3, 0x00008067, 0x12a57653, 0x22a506d3,
  0x00800793, 0x00000717, 0x12c73707, 0x00000717,
  0x12c73007, 0x00000717, 0x12c73587, 0x22c61653,
  0x0a0777d3, 0xfff7879b, 0x12e7f7d3, 0x02b77753,
  0x1af677d3, 0x12f6f6d3, 0x02d57553, 0xfe0792e3,
  0x00008067, 0x12a57653, 0x00000797, 0x0f07b587,
  0x00000797, 0x0f07b007, 0x22000753, 0x22b586d3,
  0x22b58553, 0x00800793, 0x22c61653, 0x0ab777d3,
  0xfff7879b, 0x12e7f7d3, 0x02077753, 0x1af677d3,
  0x12f6f6d3, 0x02d57553, 0xfe0792e3, 0x00008067,
  0x82818713, 0xb4818613, 0x02000693, 0xfd870793,
  0x00d78023, 0x00178793, 0xfee79ce3, 0x02878713,
  0xfec716e3, 0x00008067, 0x82818693, 0xb4818513,
  0x10000637, 0x00a00593, 0xfd868793, 0x0007c703,
  0x00178793, 0x00e60023, 0xfed79ae3, 0x00b60023,
  0x02878693, 0xfea692e3, 0x00008067, 0x00000000,
  0x4a325b1b, 0x00485b1b, 0x202d2d2d, 0x43534952,
  0x4620562d, 0x33205550, 0x65522044, 0x7265646e,
  0x2d2d2d20, 0x0000000a, 0x6d696e41, 0x6f697461,
  0x6f43206e, 0x656c706d, 0x0a2e6574, 0x00000000,
  0x00000000, 0x40080000, 0x00000000, 0x3ff00000,
  0x00000000, 0x40000000, 0x00000000, 0x40140000,
  0x00000000, 0x3fe00000, 0x00000000, 0xbff00000,
  0x00000000, 0x40200000, 0x00000000, 0x40340000,
  0x065b7d50, 0x3fec1528, 0x744b05f0, 0x3fdeaee8,
  0x00000000, 0x40100000, 0x00000000, 0x40240000,
  0x33333333, 0x3fc33333, 0x00000000, 0x00000000,
]);




let ramView = new Uint32Array(RVALUATION64.memory.buffer);
for (let i = 0; i < machineCode.length; i++) {
    ramView[i] = machineCode[i];
}

// 3. Boot
RVALUATION64.cpu.State.pc = 0x80000000n;
RVALUATION64.cpu.State.x_ram[2] = 0x80000000n + BigInt(RAM_SIZE);

console.log("Starting CPU...");

// 4. Execution Loop
try {
    while (true) {
        RVALUATION64.step();
    }
} catch (e) {
    console.log("CPU Halted with Reason:", e.message);
}


// EXAMPLE SCRIPT

/*

typedef signed long long   int64_t;

#define UART_BASE 0x10000000
#define UART_REG_TX ((volatile char*)(UART_BASE + 0))

void uart_putc(char c) { *UART_REG_TX = c; }
void uart_print(const char* s) { while (*s) uart_putc(*s++); }

// ANSI escape code to clear the terminal and reset cursor
void clear_screen() { uart_print("\033[2J\033[H"); }

static inline double builtin_sqrt(double x) {
    double res;
    __asm__ volatile ("fsqrt.d %0, %1" : "=f"(res) : "f"(x));
    return res;
}

double my_sin(double x) {
    double res = x, term = x, x2 = x * x;
    for (double i = 3.0; i < 18.0; i += 2.0) {
        term *= -x2 / (i * (i - 1.0));
        res += term;
    }
    return res;
}

double my_cos(double x) {
    double res = 1.0, term = 1.0, x2 = x * x;
    for (double i = 2.0; i < 18.0; i += 2.0) {
        term *= -x2 / (i * (i - 1.0));
        res += term;
    }
    return res;
}

typedef struct { double x, y, z; } Vec3;

// ASCII Render Grid (Width x Height)
#define WIDTH 40
#define HEIGHT 20
char screen[HEIGHT][WIDTH];

void clear_buffer() {
    for (int y = 0; y < HEIGHT; y++) {
        for (int x = 0; x < WIDTH; x++) {
            screen[y][x] = ' ';
        }
    }
}

void draw_buffer() {
    for (int y = 0; y < HEIGHT; y++) {
        for (int x = 0; x < WIDTH; x++) {
            uart_putc(screen[y][x]);
        }
        uart_putc('\n');
    }
}

int main() {
    double root5 = builtin_sqrt(5.0);
    double phi = (1.0 + root5) / 2.0;

    // A subset of vertices for the shape
    Vec3 vertices[12] = {
        {0, 1, phi}, {0, -1, phi}, {0, 1, -phi}, {0, -1, -phi},
        {1, phi, 0}, {-1, phi, 0}, {1, -phi, 0}, {-1, -phi, 0},
        {phi, 0, 1}, {-phi, 0, 1}, {phi, 0, -1}, {-phi, 0, -1}
    };

    double angle = 0.0;

    // Animate for 50 frames
    for (int frame = 0; frame < 50; frame++) {
        clear_screen();
        clear_buffer();
        uart_print("--- RISC-V FPU 3D Render ---\n");

        double s = my_sin(angle);
        double c = my_cos(angle);

        for (int i = 0; i < 12; i++) {
            // Rotate around Y axis
            double rx = vertices[i].x * c + vertices[i].z * s;
            double rz = -vertices[i].x * s + vertices[i].z * c;
            double ry = vertices[i].y;

            // Rotate around X axis to tilt it slightly
            double tilt_s = my_sin(0.5);
            double tilt_c = my_cos(0.5);
            double ry2 = ry * tilt_c - rz * tilt_s;
            
            // Simple 3D to 2D Orthographic Projection
            int px = (int)((rx * 8.0) + (WIDTH / 2));
            int py = (int)((ry2 * 4.0) + (HEIGHT / 2)); // Scale Y down for terminal fonts

            // Bounds check and draw
            if (px >= 0 && px < WIDTH && py >= 0 && py < HEIGHT) {
                screen[py][px] = '@'; 
            }
        }

        draw_buffer();
        
        // Delay loop (adjust size based on your emulator speed)
        for(volatile int d=0; d<50000; d++); 
        
        angle += 0.15;
    }

    uart_print("Animation Complete.\n");
    __asm__ volatile("ebreak");
    return 0;
}
*/
