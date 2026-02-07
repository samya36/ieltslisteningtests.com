#!/usr/bin/env python3
"""
音频文件清单生成器
生成包含音频文件信息、完整性校验和元数据的JSON清单
"""

import os
import json
import hashlib
import subprocess
import sys
from datetime import datetime
from pathlib import Path

class AudioManifestGenerator:
    def __init__(self, audio_dir="../audio"):
        self.audio_dir = Path(audio_dir)
        self.supported_formats = ['.mp3', '.m4a', '.wav', '.ogg']
        self.required_tests = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7']
        self.required_sections = ['section1', 'section2', 'section3', 'section4']
        
    def calculate_file_hash(self, file_path):
        """计算文件的SHA256哈希值"""
        try:
            hasher = hashlib.sha256()
            with open(file_path, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hasher.update(chunk)
            return hasher.hexdigest()
        except Exception as e:
            print(f"计算哈希失败: {file_path}, 错误: {e}")
            return None

    def get_audio_metadata(self, file_path):
        """使用ffprobe获取音频元数据"""
        try:
            # 获取基本信息
            cmd_duration = [
                'ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
                '-of', 'csv=p=0', str(file_path)
            ]
            duration = subprocess.check_output(cmd_duration, text=True).strip()
            
            cmd_bitrate = [
                'ffprobe', '-v', 'quiet', '-show_entries', 'format=bit_rate',
                '-of', 'csv=p=0', str(file_path)
            ]
            bitrate = subprocess.check_output(cmd_bitrate, text=True).strip()
            
            cmd_codec = [
                'ffprobe', '-v', 'quiet', '-show_entries', 'stream=codec_name',
                '-select_streams', 'a:0', '-of', 'csv=p=0', str(file_path)
            ]
            codec = subprocess.check_output(cmd_codec, text=True).strip()
            
            cmd_channels = [
                'ffprobe', '-v', 'quiet', '-show_entries', 'stream=channels',
                '-select_streams', 'a:0', '-of', 'csv=p=0', str(file_path)
            ]
            channels = subprocess.check_output(cmd_channels, text=True).strip()
            
            cmd_sample_rate = [
                'ffprobe', '-v', 'quiet', '-show_entries', 'stream=sample_rate',
                '-select_streams', 'a:0', '-of', 'csv=p=0', str(file_path)
            ]
            sample_rate = subprocess.check_output(cmd_sample_rate, text=True).strip()
            
            return {
                'duration': float(duration) if duration else 0.0,
                'bitrate': int(bitrate) if bitrate else 0,
                'codec': codec,
                'channels': int(channels) if channels else 0,
                'sample_rate': int(sample_rate) if sample_rate else 0
            }
        except Exception as e:
            print(f"获取元数据失败: {file_path}, 错误: {e}")
            return {
                'duration': 0.0,
                'bitrate': 0,
                'codec': 'unknown',
                'channels': 0,
                'sample_rate': 0
            }

    def validate_audio_integrity(self, file_path):
        """验证音频文件完整性"""
        try:
            # 尝试解码音频文件的开头和结尾
            cmd_test = [
                'ffmpeg', '-v', 'quiet', '-i', str(file_path),
                '-t', '5', '-f', 'null', '-'
            ]
            subprocess.check_output(cmd_test, stderr=subprocess.STDOUT)
            
            cmd_test_end = [
                'ffmpeg', '-v', 'quiet', '-i', str(file_path),
                '-ss', '-5', '-f', 'null', '-'
            ]
            subprocess.check_output(cmd_test_end, stderr=subprocess.STDOUT)
            
            return True
        except Exception:
            return False

    def process_audio_file(self, file_path):
        """处理单个音频文件，收集所有信息"""
        file_stat = file_path.stat()
        file_info = {
            'filename': file_path.name,
            'path': str(file_path.relative_to(self.audio_dir)),
            'size': file_stat.st_size,
            'modified_time': datetime.fromtimestamp(file_stat.st_mtime).isoformat(),
            'format': file_path.suffix.lower(),
            'sha256': self.calculate_file_hash(file_path),
            'metadata': self.get_audio_metadata(file_path),
            'integrity_check': self.validate_audio_integrity(file_path)
        }
        
        # 添加质量评估
        file_info['quality_assessment'] = self.assess_audio_quality(file_info)
        
        return file_info

    def assess_audio_quality(self, file_info):
        """评估音频质量"""
        assessment = {
            'overall': 'good',
            'issues': []
        }
        
        metadata = file_info['metadata']
        size = file_info['size']
        
        # 检查文件大小
        size_mb = size / (1024 * 1024)
        if size_mb > 50:
            assessment['issues'].append('file_too_large')
            assessment['overall'] = 'warning'
        elif size_mb < 1:
            assessment['issues'].append('file_too_small')
            assessment['overall'] = 'warning'
        
        # 检查时长
        duration = metadata['duration']
        if duration < 60:
            assessment['issues'].append('duration_too_short')
            assessment['overall'] = 'warning'
        elif duration > 1800:  # 30分钟
            assessment['issues'].append('duration_too_long')
            assessment['overall'] = 'warning'
        
        # 检查比特率
        bitrate = metadata['bitrate']
        if bitrate > 0:
            if bitrate < 64000:
                assessment['issues'].append('bitrate_too_low')
                assessment['overall'] = 'warning'
            elif bitrate > 320000:
                assessment['issues'].append('bitrate_too_high')
                assessment['overall'] = 'warning'
        
        # 检查完整性
        if not file_info['integrity_check']:
            assessment['issues'].append('integrity_failed')
            assessment['overall'] = 'error'
        
        return assessment

    def generate_manifest(self):
        """生成完整的音频文件清单"""
        manifest = {
            'generated_at': datetime.utcnow().isoformat() + 'Z',
            'generator_version': '1.0.0',
            'audio_directory': str(self.audio_dir),
            'tests': {},
            'summary': {
                'total_files': 0,
                'total_size': 0,
                'total_duration': 0.0,
                'missing_files': [],
                'quality_issues': []
            }
        }
        
        total_files = 0
        total_size = 0
        total_duration = 0.0
        missing_files = []
        quality_issues = []
        
        # 处理每个测试目录
        for test_name in self.required_tests:
            test_dir = self.audio_dir / test_name
            test_info = {
                'name': test_name,
                'path': str(test_dir.relative_to(self.audio_dir)) if test_dir.exists() else None,
                'exists': test_dir.exists(),
                'sections': {},
                'total_duration': 0.0,
                'total_size': 0
            }
            
            if test_dir.exists():
                # 处理每个section
                for section_name in self.required_sections:
                    section_file = None
                    
                    # 查找对应的音频文件
                    for ext in self.supported_formats:
                        potential_file = test_dir / f"{section_name}{ext}"
                        if potential_file.exists():
                            section_file = potential_file
                            break
                    
                    if section_file:
                        print(f"处理文件: {section_file}")
                        file_info = self.process_audio_file(section_file)
                        test_info['sections'][section_name] = file_info
                        
                        # 更新统计信息
                        total_files += 1
                        total_size += file_info['size']
                        total_duration += file_info['metadata']['duration']
                        test_info['total_duration'] += file_info['metadata']['duration']
                        test_info['total_size'] += file_info['size']
                        
                        # 收集质量问题
                        if file_info['quality_assessment']['overall'] in ['warning', 'error']:
                            quality_issues.append({
                                'file': str(section_file.relative_to(self.audio_dir)),
                                'issues': file_info['quality_assessment']['issues']
                            })
                    else:
                        missing_files.append(f"{test_name}/{section_name}")
                        test_info['sections'][section_name] = None
            else:
                missing_files.extend([f"{test_name}/{section}" for section in self.required_sections])
            
            manifest['tests'][test_name] = test_info
        
        # 更新摘要信息
        manifest['summary']['total_files'] = total_files
        manifest['summary']['total_size'] = total_size
        manifest['summary']['total_duration'] = total_duration
        manifest['summary']['missing_files'] = missing_files
        manifest['summary']['quality_issues'] = quality_issues
        manifest['summary']['average_file_size'] = total_size / total_files if total_files > 0 else 0
        manifest['summary']['average_duration'] = total_duration / total_files if total_files > 0 else 0
        
        return manifest

    def save_manifest(self, manifest, output_file='audio-manifest.json'):
        """保存清单到JSON文件"""
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(manifest, f, indent=2, ensure_ascii=False)
            print(f"✓ 音频清单已生成: {output_file}")
            return True
        except Exception as e:
            print(f"❌ 保存清单失败: {e}")
            return False

    def print_summary(self, manifest):
        """打印清单摘要"""
        summary = manifest['summary']
        
        print("\n=== 音频文件清单摘要 ===")
        print(f"生成时间: {manifest['generated_at']}")
        print(f"总文件数: {summary['total_files']}")
        print(f"总大小: {summary['total_size'] / (1024*1024):.2f} MB")
        print(f"总时长: {summary['total_duration']:.2f} 秒 ({summary['total_duration']/60:.1f} 分钟)")
        print(f"平均文件大小: {summary['average_file_size'] / (1024*1024):.2f} MB")
        print(f"平均时长: {summary['average_duration']:.2f} 秒")
        
        if summary['missing_files']:
            print(f"\n❌ 缺失文件 ({len(summary['missing_files'])}个):")
            for missing in summary['missing_files']:
                print(f"  - {missing}")
        
        if summary['quality_issues']:
            print(f"\n⚠️  质量问题 ({len(summary['quality_issues'])}个):")
            for issue in summary['quality_issues']:
                print(f"  - {issue['file']}: {', '.join(issue['issues'])}")
        
        if not summary['missing_files'] and not summary['quality_issues']:
            print("\n🎉 所有音频文件检查通过！")

def main():
    """主函数"""
    print("=== 音频文件清单生成器 ===")
    
    # 检查依赖
    try:
        subprocess.check_output(['ffprobe', '-version'], stderr=subprocess.DEVNULL)
    except FileNotFoundError:
        print("❌ 错误: ffprobe未安装，请安装ffmpeg")
        sys.exit(1)
    
    # 生成清单
    generator = AudioManifestGenerator()
    
    if not generator.audio_dir.exists():
        print(f"❌ 错误: 音频目录不存在: {generator.audio_dir}")
        sys.exit(1)
    
    print(f"扫描音频目录: {generator.audio_dir}")
    manifest = generator.generate_manifest()
    
    # 保存清单
    if generator.save_manifest(manifest):
        generator.print_summary(manifest)
        
        # 检查是否有严重问题
        summary = manifest['summary']
        if summary['missing_files'] or any(
            'integrity_failed' in issue['issues'] or 'error' in str(issue)
            for issue in summary['quality_issues']
        ):
            print("\n❌ 发现严重问题，请检查上述错误")
            sys.exit(1)
        else:
            print("\n✓ 清单生成成功")
            sys.exit(0)
    else:
        sys.exit(1)

if __name__ == '__main__':
    main()